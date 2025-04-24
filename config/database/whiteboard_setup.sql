create database whiteboard;
use whiteboard;
drop table if exists `viewed_comments`;
drop table if exists `comments`;
drop table if exists `milestones`;
drop table if exists `tasks`;
drop table if exists `team_members`;
drop table if exists `teams`;
drop table if exists `project_languages`;
drop table if exists `projects`;
drop table if exists `user_specialties`;
drop table if exists `languages`;
drop table if exists `users`;
drop table if exists `sprints`;
drop view if exists `v_comment_home_page`;
drop view if exists `v_comment_count_by_task`;
drop view if exists `v_tasks_for_sprint`;
drop view if exists `v_filtered_tasks_for_sprint`;
drop view if exists `v_incomplete_tasks`;
drop view if exists `v_tasks`;


create table languages (
	id int auto_increment primary key,
	language varchar(40) not null
) engine = InnoDB;
	
create table users (
	id int auto_increment primary key,
	first_name varchar(40) not null,
	last_name varchar(40) not null,
	email varchar(40) not null,
	password varchar(40) not null,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table projects (
	id int auto_increment primary key,
	name varchar(100) not null,
	start_date date not null,
	end_date date,
	description varchar(1000),
	inactive tinyint(1) not null default 0,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table project_languages (
	id int auto_increment primary key,
	project int not null,
	language int not null,
	deleted tinyint(1)not null default 0,
	foreign key fk_proj_lang_project(project) references projects(id),
	foreign key fk_proj_lang_language(language) references languages(id)
) engine = InnoDB;

create table teams (
	id int auto_increment primary key,
	project int not null,
	foreign key fk_teams_project(project) references projects(id),
	name varchar(40) not null,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table team_for_project(
	id int auto_increment primary key,
	project int not null,
	team int not null,
	foreign key fk_team_team(team) references teams(id),
	foreign key fk_team_project(project) references projects(id),
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table team_members (
	id int auto_increment primary key,
	team int not null,
	foreign key fk_team_members_team(team) references teams(id),
	team_mate int not null,
	foreign key fl_team_members_mate(team_mate) references users(id),
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table sprints (
	id int auto_increment primary key,
	start_date date not null,
	end_date date,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

insert into sprints (start_date) values (curdate());

create table tasks (
	id int auto_increment primary key,
	project int not null,
	foreign key fk_task_project(project) references projects(id),
	user int not null,
	foreign key fk_task_user(user) references users(id),
	subject varchar(100) not null,
	description varchar(1000),
	difficulty int not null,
	sprint int null ,
	starttime datetime,
	endtime datetime,
	hours float not null default 0.0,
	state tinyint(4) not null default 0,
	foreign key fk_task_sprint(sprint) references sprints(id),
	completed int,
	type int not null default 0,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table milestones (
	id int auto_increment primary key,
	name varchar(40) not null,
	project int not null,
	task int not null,
	foreign key fk_task(task) references tasks(id),
	foreign key fk_project(project) references projects(id),
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table comments (
	id int auto_increment primary key,
	task_id int not null,
	foreign key fk_comment_task(task_id) references tasks(id),
	user int not null,
	foreign key fk_comment_user(user) references users(id),
	comment varchar(1000) not null,
	comment_date date not null,
	viewed tinyint(1) not null default 0,
	deleted tinyint(1) not null default 0	
) engine = InnoDB;

create table user_specialties (
	id int auto_increment primary key,
	user int not null,
	language int not null,
	foreign key fk_spec_user(user) references users(id),
	foreign key fk_spec_lang(language) references languages(id),
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table viewed_comments (
	id int auto_increment primary key,
	comment int not null,
	foreign key fk_viewed_comment(comment) references comments(id),
	viewer int not null,
	foreign key fk_viewed_viewer(viewer) references users(id),
	unread tinyint(1) not null default 0,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create or replace view v_comment_home_page as
	select viewed_comments.id, users.first_name, users.last_name, users.email, tasks.difficulty, 
	tasks.subject, comments.comment, viewed_comments.unread, viewed_comments.viewer, comments.comment_date,
	projects.name
	from viewed_comments
	join comments on viewed_comments.comment = comments.id
	join  tasks on comments.task_id = tasks.id
	join projects on tasks.project = projects.id
	join users on tasks.user = users.id
	where viewed_comments.deleted = 0 or comments.deleted = 0;

create or replace view v_comment_count_by_task as
	select tasks.id, count(comments.id) as comment_count from tasks
	left join comments on comments.task_id = tasks.id 
	group by tasks.id;

create or replace view v_tasks_for_sprint as
	select tasks.id, tasks.subject, tasks.difficulty, projects.name, tasks.state, tasks.user, tasks.type, tasks.sprint, 
	v_comment_count_by_task.comment_count, milestones.name as milestone, projects.id as project_id from tasks
	join projects on tasks.project = projects.id 
	left join v_comment_count_by_task on tasks.id = v_comment_count_by_task.id 
	left join milestones on tasks.id = milestones.task and milestones.deleted = 0 
	where projects.deleted = 0;

create or replace view v_performance_overall as
	select count(*) as count from sprints
	union
	select sum(difficulty) from tasks
	union select sum(difficulty) from tasks 
	where sprint is not null and completed is not null;
		
	
create or replace view v_filtered_tasks_for_sprint as
	select tasks.id, tasks.subject, tasks.difficulty, projects.name, tasks.state, tasks.user, tasks.sprint, 
	v_comment_count_by_task.comment_count, projects.id as project_id, milestones.name as milestone from tasks
	join projects on tasks.project = projects.id
	left join v_comment_count_by_task on tasks.id = v_comment_count_by_task.id
	left join milestones on tasks.id = milestones.task and milestones.deleted = 0 
	where projects.deleted = 0;	
	
create or replace view v_incomplete_tasks as
	select tasks.id, tasks.difficulty, tasks.subject, projects.name, projects.id as project_id, tasks.type from tasks
	join projects on tasks.project = projects.id
	where tasks.sprint is null and tasks.deleted = 0  and projects.deleted = 0 order by tasks.id desc;
	
create or replace view v_tasks as
	select tasks.difficulty, tasks.id, projects.name, projects.start_date, projects.end_date, tasks.type, 
	projects.description as project_description, tasks.subject, tasks.description, tasks.state, 
	projects.id as project_id, tasks.sprint from tasks
	join projects on tasks.project = projects.id
	where tasks.deleted = 0 and tasks.completed is null order by tasks.id desc;
	
drop trigger if exists `ins_views`;
delimiter |
create trigger ins_views after insert on comments 
for each row 
	begin
	 DECLARE finished INT DEFAULT 0;
	 DECLARE viewerid INT DEFAULT 0;	 
	 DECLARE currentId CURSOR FOR SELECT id FROM users WHERE id != NEW.user; 
	 DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;	 
	 OPEN currentId; 
	 update_views_loop: LOOP
	 	FETCH currentId INTO viewerid;
	 	IF finished = 1 THEN LEAVE update_views_loop; END IF;
	
		INSERT INTO viewed_comments (comment, viewer) VALUES (NEW.id, viewerid);
	
	 END LOOP update_views_loop;
	 CLOSE currentId; 
	END;
|

delimiter ;
