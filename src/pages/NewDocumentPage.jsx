import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDocuments } from '../contexts/DocumentContext';
import { useResume } from '../contexts/ResumeContext';
import { employerService } from '../api';

const NewDocumentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Get document type from URL params or default to CV
  const defaultType = searchParams.get('type') === 'cover_letter' ? 'cover_letter' : 'cv';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    documentType: defaultType,
    title: '',
    employerName: '',
    employerUrl: '',
    jobTitle: '',
    jobDescription: '',
    useAllExperiences: true,
    selectedExperienceIds: [],
    selectedEducationIds: [],
    selectedAchievementIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [employerValues, setEmployerValues] = useState([]);
  const [isScraping, setIsScraping] = useState(false);
  
  const { generateDocument } = useDocuments();
  const { experiences, educations, achievements, loading } = useResume();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (e, itemType) => {
    const { value, checked } = e.target;
    
    const fieldName = `selected${itemType}Ids`;
    const currentIds = [...formData[fieldName]];
    
    if (checked) {
      // Add ID to selection
      currentIds.push(value);
    } else {
      // Remove ID from selection
      const index = currentIds.indexOf(value);
      if (index !== -1) {
        currentIds.splice(index, 1);
      }
    }
    
    setFormData({ ...formData, [fieldName]: currentIds });
  };

  // Handle scraping employer website
  const handleScrapeEmployer = async () => {
    if (!formData.employerUrl) {
      setError('Please enter an employer website URL');
      return;
    }
    
    setIsScraping(true);
    setError('');
    
    try {
      const employer = await employerService.scrapeEmployer(formData.employerUrl);
      setEmployerValues(employer.values || []);
      setFormData({
        ...formData,
        employerName: employer.name,
      });
    } catch (err) {
      setError('Failed to scrape employer website. Please enter details manually.');
    } finally {
      setIsScraping(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title) {
      setError('Please provide a title for your document');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare data for API
      const generationData = {
        document_type: formData.documentType,
        employer_name: formData.employerName,
        job_title: formData.jobTitle,
        job_description: formData.jobDescription,
        use_all_experiences: formData.useAllExperiences,
      };
      
      // Only include selected items if not using all
      if (!formData.useAllExperiences) {
        generationData.experience_ids = formData.selectedExperienceIds;
        generationData.education_ids = formData.selectedEducationIds;
        generationData.achievement_ids = formData.selectedAchievementIds;
      }
      
      const document = await generateDocument(generationData);
      
      // Navigate to document page
      navigate(`/documents/${document.id}`);
    } catch (err) {
      setError('Failed to generate document. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Go to previous step
  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render document type selection step
  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Step 1: Choose Document Type
      </h3>
      
      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <input
            id="document-type-cv"
            name="documentType"
            type="radio"
            value="cv"
            checked={formData.documentType === 'cv'}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
          <label htmlFor="document-type-cv" className="ml-3 block text-sm font-medium text-gray-700">
            CV / Resume
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="document-type-cover-letter"
            name="documentType"
            type="radio"
            value="cover_letter"
            checked={formData.documentType === 'cover_letter'}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
          <label htmlFor="document-type-cover-letter" className="ml-3 block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
        </div>
      </div>
      
      <div className="mt-8">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Document Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={`My ${formData.documentType === 'cv' ? 'CV' : 'Cover Letter'}`}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  // Render employer information step
  const renderStep2 = () => (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Step 2: Employer Information
      </h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="employerUrl" className="block text-sm font-medium text-gray-700">
            Employer Website (optional)
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="url"
              name="employerUrl"
              id="employerUrl"
              value={formData.employerUrl}
              onChange={handleChange}
              placeholder="https://www.example.com"
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            />
            <button
              type="button"
              onClick={handleScrapeEmployer}
              disabled={isScraping || !formData.employerUrl}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isScraping ? 'Scanning...' : 'Scan Values'}
            </button>
          </div>
          {employerValues.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Company values found:</p>
              <div className="flex flex-wrap gap-2">
                {employerValues.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="employerName" className="block text-sm font-medium text-gray-700">
            Employer Name
          </label>
          <input
            type="text"
            name="employerName"
            id="employerName"
            value={formData.employerName}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            id="jobDescription"
            rows={4}
            value={formData.jobDescription}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Paste the job description here..."
          />
        </div>
      </div>
    </div>
  );

  // Render experience selection step
  const renderStep3 = () => (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Step 3: Select Experiences
      </h3>
      
      {loading ? (
        <div className="py-10 flex justify-center">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  The selected items will be used to generate your {formData.documentType === 'cv' ? 'CV' : 'Cover Letter'}.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="useAllExperiences"
                name="useAllExperiences"
                type="checkbox"
                checked={formData.useAllExperiences}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="useAllExperiences" className="font-medium text-gray-700">
                Use all my experiences
              </label>
              <p className="text-gray-500">
                We'll include all your work experiences, education, and achievements.
              </p>
            </div>
          </div>
          
          {!formData.useAllExperiences && (
            <div className="space-y-6">
              {/* Work Experiences */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Work Experiences</h4>
                {experiences.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No work experiences added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`exp-${exp.id}`}
                            value={exp.id}
                            type="checkbox"
                            checked={formData.selectedExperienceIds.includes(exp.id)}
                            onChange={(e) => handleMultiSelectChange(e, 'Experience')}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`exp-${exp.id}`} className="font-medium text-gray-700">
                            {exp.job_title} at {exp.company_name}
                          </label>
                          <p className="text-gray-500">
                            {new Date(exp.start_date).toLocaleDateString()} - 
                            {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Education */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Education</h4>
                {educations.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No education entries added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {educations.map((edu) => (
                      <div key={edu.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`edu-${edu.id}`}
                            value={edu.id}
                            type="checkbox"
                            checked={formData.selectedEducationIds.includes(edu.id)}
                            onChange={(e) => handleMultiSelectChange(e, 'Education')}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`edu-${edu.id}`} className="font-medium text-gray-700">
                            {edu.degree} in {edu.field_of_study}
                          </label>
                          <p className="text-gray-500">
                            {edu.institution}, {new Date(edu.start_date).toLocaleDateString()} - 
                            {edu.is_current ? 'Present' : new Date(edu.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Achievements */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Achievements</h4>
                {achievements.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No achievements added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`ach-${achievement.id}`}
                            value={achievement.id}
                            type="checkbox"
                            checked={formData.selectedAchievementIds.includes(achievement.id)}
                            onChange={(e) => handleMultiSelectChange(e, 'Achievement')}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`ach-${achievement.id}`} className="font-medium text-gray-700">
                            {achievement.title}
                          </label>
                          <p className="text-gray-500">
                            {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'No date'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render form steps based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New {formData.documentType === 'cv' ? 'CV' : 'Cover Letter'}
          </h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${(currentStep / 3) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
            ></div>
          </div>
          <div className="flex text-xs mt-2 justify-between">
            <div className={`${currentStep >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              Document Type
            </div>
            <div className={`${currentStep >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              Employer Details
            </div>
            <div className={`${currentStep >= 3 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              Select Experience
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderCurrentStep()}
            
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Generating...' : 'Generate Document'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewDocumentPage;