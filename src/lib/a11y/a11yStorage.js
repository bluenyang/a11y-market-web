// src/lib/a11yStorage.js

const STORAGE_KEY = 'a11y-settings'

// 접근성 설정 저장
export const saveA11y = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// 접근성 설정 로드
export const loadA11y = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
}

// 접근성 설정 삭제 (선택)
// export const clearA11y = () => {
//     localStorage.removeItem(STORAGE_KEY)
// }