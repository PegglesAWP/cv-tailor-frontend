import React, { createContext, useState, useEffect, useContext } from 'react';
import { experienceService } from '../api';
import { useAuth } from './AuthContext';

// Create context
const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    } else {
      // Reset state when not authenticated
      setExperiences([]);
      setEducations([]);
      setAchievements([]);
    }
  }, [isAuthenticated]);

  // Load all user data
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [experiencesData, educationsData, achievementsData] = await Promise.all([
        experienceService.getAllExperiences(),
        experienceService.getAllEducations(),
        experienceService.getAllAchievements(),
      ]);
      
      setExperiences(experiencesData);
      setEducations(educationsData);
      setAchievements(achievementsData);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load your profile data');
    } finally {
      setLoading(false);
    }
  };

  // Experience methods
  const addExperience = async (experienceData) => {
    try {
      setLoading(true);
      const newExperience = await experienceService.createExperience(experienceData);
      setExperiences([...experiences, newExperience]);
      return newExperience;
    } catch (err) {
      setError('Failed to add experience');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExperience = async (id, experienceData) => {
    try {
      setLoading(true);
      const updatedExperience = await experienceService.updateExperience(id, experienceData);
      setExperiences(
        experiences.map((exp) => (exp.id === id ? updatedExperience : exp))
      );
      return updatedExperience;
    } catch (err) {
      setError('Failed to update experience');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    try {
      setLoading(true);
      await experienceService.deleteExperience(id);
      setExperiences(experiences.filter((exp) => exp.id !== id));
    } catch (err) {
      setError('Failed to delete experience');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Education methods
  const addEducation = async (educationData) => {
    try {
      setLoading(true);
      const newEducation = await experienceService.createEducation(educationData);
      setEducations([...educations, newEducation]);
      return newEducation;
    } catch (err) {
      setError('Failed to add education');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (id, educationData) => {
    try {
      setLoading(true);
      const updatedEducation = await experienceService.updateEducation(id, educationData);
      setEducations(
        educations.map((edu) => (edu.id === id ? updatedEducation : edu))
      );
      return updatedEducation;
    } catch (err) {
      setError('Failed to update education');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (id) => {
    try {
      setLoading(true);
      await experienceService.deleteEducation(id);
      setEducations(educations.filter((edu) => edu.id !== id));
    } catch (err) {
      setError('Failed to delete education');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Achievement methods
  const addAchievement = async (achievementData) => {
    try {
      setLoading(true);
      const newAchievement = await experienceService.createAchievement(achievementData);
      setAchievements([...achievements, newAchievement]);
      return newAchievement;
    } catch (err) {
      setError('Failed to add achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAchievement = async (id, achievementData) => {
    try {
      setLoading(true);
      const updatedAchievement = await experienceService.updateAchievement(id, achievementData);
      setAchievements(
        achievements.map((ach) => (ach.id === id ? updatedAchievement : ach))
      );
      return updatedAchievement;
    } catch (err) {
      setError('Failed to update achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (id) => {
    try {
      setLoading(true);
      await experienceService.deleteAchievement(id);
      setAchievements(achievements.filter((ach) => ach.id !== id));
    } catch (err) {
      setError('Failed to delete achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    experiences,
    educations,
    achievements,
    loading,
    error,
    loadUserData,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addAchievement,
    updateAchievement,
    deleteAchievement,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

// Custom hook to use the resume context
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export default ResumeContext;