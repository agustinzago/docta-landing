import { db } from '@/lib/db'
import React from 'react'
import ProfilePicture from './_components/ProfilePictre'
import { currentUser } from '@clerk/nextjs/server'
import ProfileForm from '@/components/forms/profile-form'

const Settings = async () => {
  const authUser = await currentUser();
  if (!authUser) {
    return null
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: authUser.id,
    },
  })

  const removeProfileImage = async () => {
    'use server'
    try {
      await db.user.update({
        where: {
          clerkId: authUser.id,
        },
        data: {
          profileImage: '',
        },
      })
      return true
    } catch (error) {
      console.error("Error removing profile image:", error)
      return false
    }
  }

  const updateUserInfo = async (name: string) => {
    'use server'

    const updateUser = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        name,
      },
    })
    return updateUser
  }


  const uploadProfileImage = async (image: string) => {
    'use server'
    try {
      await db.user.update({
        where: {
          clerkId: authUser.id,
        },
        data: {
          profileImage: image,
        },
      })
      return true
    } catch (error) {
      console.error("Error uploading profile image:", error)
      return false
    }
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
          userImage={user?.profileImage || ''}
          onUpload={uploadProfileImage}
        />
        <ProfileForm
          user={user}
          onUpdate={updateUserInfo}
        />
      </div>
    </div>
  )
}

export default Settings
