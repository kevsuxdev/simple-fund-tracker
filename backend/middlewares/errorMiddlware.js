const notFound = (request, response, next) => {
  const error = new Error(`Not found: ${request.originalUrl}`)
  response.status(404)
  next(error)
}

const errorHandler = (error, request, response, next) => {
  let statusCode = response.statusCode === 200 ? 500 : response.statusCode
  let message = error.message

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resources not found'
  }

  response.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  })
}

export { notFound, errorHandler }
