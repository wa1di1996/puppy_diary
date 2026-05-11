import { useState } from 'react'
import { processImage } from '../utils/imageUtils'

export function PhotoUpload({ imagePreview, onImageChange, onImageStatusChange, onPhotoClick }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadErr, setUploadErr] = useState('')

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setIsProcessing(true)
    setUploadErr('')
    onImageStatusChange?.('loading')
    try {
      const processed = await processImage(file)
      onImageChange(processed)
      onImageStatusChange?.('loaded')
    } catch (err) {
      onImageStatusChange?.('error')
      setUploadErr(err.message || '图片处理失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="photo-upload">
      <div className="photo-preview" onClick={imagePreview ? onPhotoClick : undefined} style={imagePreview ? { cursor: 'pointer' } : {}} title={imagePreview ? '点击查看大图' : ''}>
        {isProcessing ? (
          <span className="photo-placeholder">⏳</span>
        ) : imagePreview ? (
          <img src={imagePreview} alt="头像预览" />
        ) : (
          <span className="photo-placeholder">🐕</span>
        )}
      </div>
      {imagePreview && <span className="photo-hint" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>点击头像查看大图</span>}
      {uploadErr && <div className="feedback-banner error" style={{ marginTop: 8 }}>{uploadErr}</div>}
      <input type="file" accept="image/*" id="dog-photo" onChange={handleUpload} style={{ display: 'none' }} />
      <label htmlFor="dog-photo" className="photo-btn">
        {isProcessing ? '处理中...' : imagePreview ? '更换照片' : '上传照片'}
      </label>
    </div>
  )
}
