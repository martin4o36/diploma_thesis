diploma_password

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT * FROM employees;
SELECT * FROM departments;

SELECT * FROM leave_types;

INSERT INTO departments(dep_name, parent_dept_id) VALUES('DriveTech Gadgets', 1);

INSERT INTO employees(first_name, last_name, age, email, work_start, work_end, manager_id, position, hired_date, department_id)
VALUES('Martin', 'Kozarev', 18, 'marti.kozarev@gmail.com', '09:00', '18:00', 0, 'CEO', '2024-10-01', 0);

DELETE FROM employees WHERE employee_id = 3;


SELECT * FROM countries;
INSERT INTO countries(country_id, country_name) VALUES(1, 'Bulgaria');