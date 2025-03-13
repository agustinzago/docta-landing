'use client'
import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next'
import '@uploadcare/react-uploader/core.css'



const UploadCareButton = () => {

  return (
    <div>
      <FileUploaderRegular
        sourceList="local, camera, url, dropbox, gdrive"
        cameraModes="photo"
        classNameUploader="uc-light"
        pubkey="a9428ff5ff90ae7a64eb" // Using your original pubkey
        // onUploaded={handleUpload}
        multiple={false}
        // previewStep={true}
      />
    </div>
  )
}

export default UploadCareButton