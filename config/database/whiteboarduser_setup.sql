create user 'whiteboarduser'@'10.0.0.%' identified by 'password';
grant select on *.* to 'whiteboarduser'@'10.0.0.%';
grant select, insert, update, delete on whiteboard.* to 'whiteboarduser'@'10.0.0.%';
create user 'whiteboarduser'@'localhost' identified by 'password';
grant select on *.* to 'whiteboarduser'@'localhost';
grant select, insert, update, delete on whiteboard.* to 'whiteboarduser'@'localhost';
flush privileges;
