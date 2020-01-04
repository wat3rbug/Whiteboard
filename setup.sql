create database whiteboard;
use whiteboard;
drop view if exists `v_comment_count_by_task`;
drop view if exists `v_tasks_for_sprint`;
drop view if exists `v_filtered_tasks_for_sprint`;
drop view if exists `v_incomplete_tasks`;
drop view if exists `v_tasks`;
drop table if exists `comments`;
drop table if exists `tasks`;
drop table if exists `milestones`;
drop table if exists `team_members`;
drop table if exists `teams`;
drop table if exists `sprints`;
drop table if exists `projects`;
drop table if exists `users`;

create table languages (
	id int auto_increment primary key,
	language varchar(40) not null
) engine = InnoDB;

create table project_languages (
	id int auto_increment primary key,
	project int not null,
	language int not null,
	deleted tinyint(1)not null default 0,
	foreign key fk_proj_lang_project(project) references projects(id),
	foreign key fk_proj_lang_language(language) references languages(id)
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

create table teams (
	id int auto_increment primary key,
	project int not null,
	foreign key fk_teams_project(project) references projects(id),
	name varchar(40) not null,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table milestones (
	id int auto_increment primary key,
	name varchar(40) not null,
	project int not null,
	foreign key fk_project(project) references projects(id),
	deleted tinyint(1) not null default 0
) engine = InnoDB;

create table sprints (
	id int auto_increment primary key,
	start_date date not null,
	end_date date,
	deleted tinyint(1) not null default 0
) engine = InnoDB;

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

create view v_comment_count_by_task as
	select tasks.id, count(comments.id) as comment_count from tasks
	left join comments on comments.task_id = tasks.id 
	group by tasks.id;

create view v_tasks_for_sprint as
	select tasks.id, tasks.subject, tasks.difficulty, projects.name, tasks.state, tasks.user, tasks.sprint, v_comment_count_by_task.comment_count from tasks
	join projects on tasks.project = projects.id
	left join v_comment_count_by_task on tasks.id = v_comment_count_by_task.id;
	
create view v_filtered_tasks_for_sprint as
	select tasks.id, tasks.subject, tasks.difficulty, projects.name, tasks.state, tasks.user, tasks.sprint, v_comment_count_by_task.comment_count, projects.id as project_id from tasks
	join projects on tasks.project = projects.id
	left join v_comment_count_by_task on tasks.id = v_comment_count_by_task.id;	
	
create view v_incomplete_tasks as
	select tasks.id, tasks.difficulty, tasks.subject, projects.name, projects.id as project_id from tasks
	join projects on tasks.project = projects.id
	where tasks.sprint is null order by tasks.id desc;
	
create view v_tasks as
	select tasks.difficulty, tasks.id, projects.name, projects.start_date, projects.end_date, tasks.type, 
	projects.description as project_description, tasks.subject, tasks.description, tasks.state, 
	projects.id as project_id, tasks.sprint from tasks
	join projects on tasks.project = projects.id
	where tasks.deleted = 0 and tasks.completed is null order by tasks.id desc;
		
	
	

