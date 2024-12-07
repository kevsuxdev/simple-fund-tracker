import jwt from 'jsonwebtoken'

const generateToken = (response, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1hr',
  })

  response.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })

  return token
}
export default generateToken
