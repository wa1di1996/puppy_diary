const defaultAvatars = [
  { name: '西高地', dataUrl: 'westie_avatar_001.png' },
  { name: '泰迪', dataUrl: 'teddy_avatar_001.png' },
  { name: '金毛', dataUrl: 'golden_avatar_001.png' },
  { name: '拉布拉多', dataUrl: 'labrador_avatar_001.png' },
  { name: '柯基', dataUrl: 'corgi_avatar_001.png' },
  { name: '柴犬', dataUrl: 'shiba_avatar_001.png' },
  { name: '法斗', dataUrl: 'frenchie_avatar_001.png' },
  { name: '哈士奇', dataUrl: 'husky_avatar_001.png' },
]

export function AvatarSelector({ selectedAvatar, onSelect }) {
  return (
    <div className="default-avatars">
      <div className="default-avatars-label">或选择默认头像：</div>
      <div className="avatar-grid">
        {defaultAvatars.map((avatar) => (
          <button
            key={avatar.name}
            type="button"
            className={`avatar-option ${selectedAvatar === avatar.dataUrl ? 'selected' : ''}`}
            onClick={() => onSelect(avatar.dataUrl)}
          >
            <img src={avatar.dataUrl} alt={avatar.name} />
          </button>
        ))}
      </div>
    </div>
  )
}
