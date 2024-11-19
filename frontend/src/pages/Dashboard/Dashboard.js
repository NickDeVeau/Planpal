import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainContent from '../../components/MainContent/MainContent';
import RightSidebar from '../../components/RightSidebar/RightSidebar';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [isExpanded, setIsExpanded] = useState(false); 
    const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false); 
    const [showMenu, setShowMenu] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskPriority, setEditTaskPriority] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [editTaskDueDate, setEditTaskDueDate] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        setTasks([
            {
                id: 1,
                title: 'Frontend | Task Name',
                priority: 'High',
                description: 'Description',
                dueDate: 'Due Tomorrow'
            },
            {
                id: 2,
                title: 'Frontend | Task Name',
                priority: 'Low',
                description: 'Description',
                dueDate: 'Due 9/10/2024'
            },
        ]);

        return () => clearInterval(interval);
    }, []);

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: Date.now(), 
            title: newTaskTitle,
            priority: newTaskPriority,
            description: newTaskDescription,
            dueDate: newTaskDueDate
        };

        setTasks([...tasks, newTask]); 

        setNewTaskTitle('');
        setNewTaskPriority('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
        setShowMenu(null);
    };

    const editTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            setEditingTaskId(id); 
            setEditTaskTitle(task.title);
            setEditTaskPriority(task.priority);
            setEditTaskDescription(task.description);
            setEditTaskDueDate(task.dueDate);
        }
        setShowMenu(null); 
    };

    const saveTask = () => {
        const updatedTasks = tasks.map((task) =>
            task.id === editingTaskId
                ? {
                      ...task,
                      title: editTaskTitle,
                      priority: editTaskPriority,
                      description: editTaskDescription,
                      dueDate: editTaskDueDate,
                  }
                : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null); 
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded); 
    };

    const toggleRightSidebarExpand = () => {
        setIsRightSidebarExpanded(!isRightSidebarExpanded); 
    };

    const toggleMenu = (taskId) => {
        setShowMenu(showMenu === taskId ? null : taskId); 
    };

    return (
        <div className="body">
            <Sidebar />
            <MainContent
                tasks={tasks}
                currentDate={currentDate}
                isExpanded={isExpanded}
                newTaskTitle={newTaskTitle}
                newTaskPriority={newTaskPriority}
                newTaskDescription={newTaskDescription}
                newTaskDueDate={newTaskDueDate}
                setNewTaskTitle={setNewTaskTitle}
                setNewTaskPriority={setNewTaskPriority}
                setNewTaskDescription={setNewTaskDescription}
                setNewTaskDueDate={setNewTaskDueDate}
                addTask={addTask}
                toggleExpand={toggleExpand}
                showMenu={showMenu}
                toggleMenu={toggleMenu}
                editTask={editTask}
                deleteTask={deleteTask}
                editingTaskId={editingTaskId}
                editTaskTitle={editTaskTitle}
                editTaskPriority={editTaskPriority}
                editTaskDescription={editTaskDescription}
                editTaskDueDate={editTaskDueDate}
                setEditTaskTitle={setEditTaskTitle}
                setEditTaskPriority={setEditTaskPriority}
                setEditTaskDescription={setEditTaskDescription}
                setEditTaskDueDate={setEditTaskDueDate}
                saveTask={saveTask}
                formatDate={formatDate}
            />
            <RightSidebar
                isRightSidebarExpanded={isRightSidebarExpanded}
                toggleRightSidebarExpand={toggleRightSidebarExpand}
            />
        </div>
    );
};

export default Dashboard;