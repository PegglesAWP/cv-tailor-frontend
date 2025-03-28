import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateDocument = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    documentType: 'cv',
    employerName: '',
    jobTitle: '',
    workExperiences: [{
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: '',
      achievements: ['']
    }],
    educations: [{
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      grade: ''
    }],
    skills: ['']
  });

  const navigate = useNavigate();

  // ------------------- Handlers ----------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updated = [...formData.workExperiences];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      workExperiences: updated
    }));
  };

  const handleAchievementChange = (expIndex, achIndex, value) => {
    const updated = [...formData.workExperiences];
    updated[expIndex].achievements[achIndex] = value;
    setFormData((prev) => ({
      ...prev,
      workExperiences: updated
    }));
  };

  const addAchievement = (expIndex) => {
    const updated = [...formData.workExperiences];
    updated[expIndex].achievements.push('');
    setFormData((prev) => ({
      ...prev,
      workExperiences: updated
    }));
  };

  const removeAchievement = (expIndex, achIndex) => {
    const updated = [...formData.workExperiences];
    updated[expIndex].achievements.splice(achIndex, 1);
    setFormData((prev) => ({
      ...prev,
      workExperiences: updated
    }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          title: '',
          company: '',
          start_date: '',
          end_date: '',
          description: '',
          achievements: ['']
        }
      ]
    }));
  };

  const removeWorkExperience = (index) => {
    if (formData.workExperiences.length > 1) {
      const updated = [...formData.workExperiences];
      updated.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        workExperiences: updated
      }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...formData.educations];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      educations: updated
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          institution: '',
          degree: '',
          field_of_study: '',
          start_date: '',
          end_date: '',
          grade: ''
        }
      ]
    }));
  };

  const removeEducation = (index) => {
    if (formData.educations.length > 1) {
      const updated = [...formData.educations];
      updated.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        educations: updated
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      skills: updated
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    if (formData.skills.length > 1) {
      const updated = [...formData.skills];
      updated.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        skills: updated
      }));
    }
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const apiData = {
        document_type: formData.documentType,
        employer_name: formData.employerName,
        job_title: formData.jobTitle,
        experiences: formData.workExperiences.map((exp) => ({
          title: exp.title,
          company: exp.company,
          start_date: exp.start_date,
          end_date: exp.end_date,
          description: exp.description,
          achievements: exp.achievements.filter((a) => a.trim() !== '')
        })),
        educations: formData.educations.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          field_of_study: edu.field_of_study,
          start_date: edu.start_date,
          end_date: edu.end_date,
          grade: edu.grade
        })),
        skills: formData.skills.filter((skill) => skill.trim() !== '')
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/documents`,
        apiData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate(`/documents/${response.data.id}`);
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err.response?.data?.detail || 'Failed to create document. Please try again.');

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Document Type</h3>
              <p className="mt-1 text-sm text-gray-500">Choose the type of document you want to create.</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="cv"
                    name="documentType"
                    type="radio"
                    value="cv"
                    checked={formData.documentType === 'cv'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="cv" className="ml-3 block text-sm font-medium text-gray-700">CV / Resume</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="cover_letter"
                    name="documentType"
                    type="radio"
                    value="cover_letter"
                    checked={formData.documentType === 'cover_letter'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="cover_letter" className="ml-3 block text-sm font-medium text-gray-700">Cover Letter</label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
              <p className="mt-1 text-sm text-gray-500">Provide details about the job you're applying for.</p>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="employerName" className="block text-sm font-medium text-gray-700">Employer / Company Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="employerName"
                      id="employerName"
                      value={formData.employerName}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="jobTitle"
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                <button
                  type="button"
                  onClick={addWorkExperience}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Add Experience
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">Add your work experience details.</p>

              {formData.workExperiences.map((exp, expIndex) => (
                <div key={expIndex} className="mt-6 border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">Experience {expIndex + 1}</h4>
                    {formData.workExperiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(expIndex)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleWorkExperienceChange(expIndex, 'title', e.target.value)}
                        className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleWorkExperienceChange(expIndex, 'company', e.target.value)}
                        className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={exp.start_date}
                        onChange={(e) => handleWorkExperienceChange(expIndex, 'start_date', e.target.value)}
                        className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={exp.end_date}
                        onChange={(e) => handleWorkExperienceChange(expIndex, 'end_date', e.target.value)}
                        className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleWorkExperienceChange(expIndex, 'description', e.target.value)}
                        className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
                        <button
                          type="button"
                          onClick={() => addAchievement(expIndex)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          Add
                        </button>
                      </div>

                      {exp.achievements.map((ach, achIndex) => (
                        <div key={achIndex} className="mt-2 flex items-center">
                          <input
                            type="text"
                            value={ach}
                            onChange={(e) => handleAchievementChange(expIndex, achIndex, e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder={`Achievement ${achIndex + 1}`}
                          />
                          {exp.achievements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAchievement(expIndex, achIndex)}
                              className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

        case 3:
            return (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Education</h3>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Add Education
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Add your educational background.</p>
    
                  {formData.educations.map((edu, eduIndex) => (
                    <div key={eduIndex} className="mt-6 border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-700">Education {eduIndex + 1}</h4>
                        {formData.educations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(eduIndex)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
    
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(eduIndex, 'institution', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(eduIndex, 'degree', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field_of_study}
                            onChange={(e) => handleEducationChange(eduIndex, 'field_of_study', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            value={edu.start_date}
                            onChange={(e) => handleEducationChange(eduIndex, 'start_date', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="date"
                            value={edu.end_date}
                            onChange={(e) => handleEducationChange(eduIndex, 'end_date', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">Grade/GPA</label>
                          <input
                            type="text"
                            value={edu.grade}
                            onChange={(e) => handleEducationChange(eduIndex, 'grade', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
    
          case 4:
            return (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Add Skill
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">List your skills and competencies.</p>
    
                  <div className="mt-4 space-y-3">
                    {formData.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(skillIndex, e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder={`Skill ${skillIndex + 1}`}
                        />
                        {formData.skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill(skillIndex)}
                            className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50"
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
    
          case 5:
            return (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Review & Generate</h3>
                  <p className="mt-1 text-sm text-gray-500">Review your information and generate your document.</p>
    
                  <div className="mt-4 space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-700">Document Type</h4>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {formData.documentType === 'cv' ? 'CV / Resume' : 'Cover Letter'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-700">Job Details</h4>
                      <div className="mt-1 grid grid-cols-2 gap-x-4 text-sm">
                        <div>
                          <p className="text-gray-500">Employer:</p>
                          <p className="text-gray-900">{formData.employerName || '(Not specified)'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Job Title:</p>
                          <p className="text-gray-900">{formData.jobTitle || '(Not specified)'}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-700">Work Experience</h4>
                      <p className="text-sm text-gray-500">{formData.workExperiences.length} experience(s) added</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-700">Education</h4>
                      <p className="text-sm text-gray-500">{formData.educations.length} education(s) added</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-700">Skills</h4>
                      <p className="text-sm text-gray-500">{formData.skills.filter((s) => s.trim() !== '').length} skill(s) added</p>
                    </div>
                  </div>
                </div>
              </div>
            );
    
          default:
            return null;
        }
      };
    
      // ------------------- Return block ----------------------
    
      return (
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold">CV Tailor</h1>
                  </div>
                </div>
              </div>
            </div>
          </nav>
    
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">{step <= 4 ? 'Create New Document' : 'Review & Generate'}</h1>
            </div>
          </header>
    
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
    
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit}>
                  {renderStep()}
                  <div className="mt-6 flex justify-between">
                    {step > 1 && step <= 4 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                    )}
    
                    {step < 5 && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                      </button>
                    )}
    
                    {step === 5 && (
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Generating...' : 'Generate Document'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      );
    };
    
    export default CreateDocument;