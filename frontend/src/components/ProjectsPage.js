// src/components/ProjectsPage.js
import React, { useState } from 'react';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', budget: '', deadline: '' });
  const [bid, setBid] = useState({ projectId: '', amount: '', message: '' });

  // Handle posting a new project
  const handlePostProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;
    const project = { ...newProject, id: Date.now(), bids: [] };
    setProjects([...projects, project]);
    setNewProject({ title: '', description: '', budget: '', deadline: '' });
  };

  // Handle submitting a bid
  const handleSubmitBid = (e, projectId) => {
    e.preventDefault();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].bids.push({ amount: bid.amount, message: bid.message, id: Date.now() });
    setProjects(updatedProjects);
    setBid({ projectId: '', amount: '', message: '' });
    alert('Budget submitted successfully!');
  };

  return (
    <div className="projects-page">
      <h1><b>Dashboard</b></h1>

      {/* Post New Project Form */}
      <section className="post-project">
        <h2></h2>
        <form onSubmit={handlePostProject}>
          <input
            type="text"
            placeholder="Budget Name"
            value={newProject.title}
            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Budget ($)"
            value={newProject.budget}
            onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
          />
          <input
            type="date"
            placeholder="Deadline"
            value={newProject.deadline}
            onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
          />
          <button type="submit">Check budget</button>
        </form>
      </section>

      {/* Projects List */}
      <section className="projects-list">
        <h2>Previous Budget resources</h2>
        {projects.length === 0 ? (
          <p>No Resources found!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>Budget: ${project.budget || 'N/A'}</p>
              <p>Deadline: {project.deadline || 'N/A'}</p>
              <p>Bids: {project.bids.length}</p>

              {/* Bid Form */}
              <form onSubmit={e => handleSubmitBid(e, project.id)} className="bid-form">
                <input
                  type="number"
                  placeholder="Your Budget details ($)"
                  value={bid.amount}
                  onChange={e => setBid({ ...bid, amount: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Message (optional)"
                  value={bid.message}
                  onChange={e => setBid({ ...bid, message: e.target.value })}
                />
                <button type="submit">Submit</button>
              </form>

              {/* List of bids */}
              {project.bids.length > 0 && (
                <div className="bids-list">
                  <h4>Total</h4>
                  <ul>
                    {project.bids.map(b => (
                      <li key={b.id}>
                        ${b.amount} - {b.message || 'No message'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
