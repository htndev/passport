export const usernameRegexp = (): RegExp => /^(?!^[._][a-z0-9_.]{1,24}$|^[a-z0-9_.]{1,24}[._]$)[a-z0-9._]{2,24}$/

export const passwordRegexp = (): RegExp => /^(?=.*[ -\/:-@\[-\`{-~]{1,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,255}$/