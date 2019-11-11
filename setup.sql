create database whiteboard;
use whiteboard;
drop table if exists `users`;
drop table if exists `projects`;
drop table if exists `milestones`;
drop table if exists `sprints`;
drop table if exists `project_users`;
drop table if exists `tasks`;
drop table if exists `comments`;
	
create table users (
	id int auto_increment primary key,
	first_name varchar(40) not null,
	last_name varchar(40) not null,
	email varchar(40) not null,
	password varchar(40) not null,
	deleted tinyint(1) not null default 0
);

create table projects (
	id int auto_increment primary key,
	name varchar(100) not null,
	start_date date not null,
	end_date date,
	deleted tinyint(1) not null default 0
);

create table milestones (
	id int auto_increment primary key,
	name varchar(40) not null,
	project int not null,
	foreign key fk_project(project) references projects(id),
	deleted tinyint(1) not null default 0
);

create table sprints (
	id int auto_increment primary key,
	project int not null,
	foreign key fk_sprints_project(project) references projects(id),
	deleted tinyint(1) not null default 0
);

create table project_users (
	id int auto_increment primary key,
	project int not null,
	user int not null,
	foreign key fk_project_users_project(project) references projects(id),
	foreign key fk_project_users_user(user) references users(id),
	deleted tinyint(1) not null default 0
);

create table tasks (
	id int auto_increment primary key,
	project int not null,
	foreign key fk_task_project(project) references projects(id),
	user int not null,
	foreign key fk_task_user(user) references users(id),
	subject varchar(100) not null,
	description varchar(1000),
	sprint int not null default 0,
	state tinyint(4) not null default 0,
	foreign key fk_task_sprint(sprint) references sprints(id),
	completed date,
	deleted tinyint(1) not null default 0
);

create table comments (
	id int auto_increment primary key,
	task_id int not null,
	foreign key fk_comment_task(task_id) references tasks(id),
	user int not null,
	foreign key fk_comment_user(user) references users(id),
	comment varchar(1000) not null,
	comment_date date not null,
	deleted tinyint(1) not null default 0	
);

