import { useState } from 'react';

import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);

  const [tasks, setTasks] = useState(
    [
      {
        id: 1,
        text: 'Doctors appointment',
        day: 'Feb 5th at 2:30pm',
        reminder: true
      },
      {
        id: 2,
        text: 'Meeting at School',
        day: 'Feb 6th at 1;30pm',
        reminder: true
      },
      {
        id: 3,
        text: 'Shopping',
        day: 'Feb 5th 4;30pm',
        reminder: false
      }
    ]
  );

  // Add a task
  const addTask = (task) => {
    const id = Math.floor(Math.random() * 10000) + 1;
    // console.log("Create task", task, " with id: ", id);

    const newTask = {id, ...task};
    setTasks([...tasks, newTask]);
  }

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  // Toggle reminder
  const toggleReminder = (id) => {
    setTasks(tasks.map((t) => t.id === id ? {...t, reminder: !t.reminder} : t));
  }

  return (
    <div className='container'>
      <Header title='Task Tracker'
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />

      {showAddTask && <AddTask onAdd={addTask}/>}

      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : ( 'No remaining tasks.' ) }
    </div>
  );
}

export default App;
