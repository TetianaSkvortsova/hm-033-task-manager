import React from 'react';
import './NewProjectPage.css';
import ProjectForm from "../../components/ProjectForm/ProjectForm.jsx";

// Ця сторінка відповідає лише за створення нового проекту
export default function NewProjectPage() {
  // Просто відображаємо форму без передачі initialData
  return <ProjectForm />;
}