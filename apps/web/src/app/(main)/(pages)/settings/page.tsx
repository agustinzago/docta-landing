'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProfilePicture from './_components/ProfilePictre';
import ProfileForm from '@/components/forms/profile-form';
import { db } from '@/lib/db';

const Settings = () => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  const removeProfileImage = async () => {
    if (!user) return false;
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/users/${user.id}/profile-image`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar imagen de perfil');
      }
      
      await refreshUser();
      return true;
    } catch (error) {
      console.error("Error removing profile image:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateUserInfo = async (name: string) => {
    if (!user) return null;
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar información de usuario');
      }
      
      const updatedUser = await response.json();
      await refreshUser();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user info:", error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadProfileImage = async (image: string) => {
    if (!user) return false;
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/users/${user.id}/profile-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ profileImage: image }),
      });
      
      if (!response.ok) {
        throw new Error('Error al subir imagen de perfil');
      }
      
      await refreshUser();
      return true;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your information
          </p>
        </div>
        <ProfilePicture
          onDelete={removeProfileImage}
          userImage={user.profileImage || ''}
          onUpload={uploadProfileImage}
        />
        <ProfileForm
          user={user}
          onUpdate={updateUserInfo}
        />
      </div>
    </div>
  );
};

export default Settings;
