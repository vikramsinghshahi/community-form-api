
# Endpoints

### Register User:


`method -> POST`
`pathname -> /api/users/register`

required fields are
username, email, password
optional fields are
name, image, bio
It should return user document according to above User specs.

### Login User
`
`method -> POST`
`pathname -> /api/users/login`
required fields are
email, password
no optional fields
It should return user document according to above User specs.

### Current User

`method -> GET`
`pathname -> /api/users/current-user`
authentication required(token)
It should return user document according to above User specs.

### Profile Information

`method -> GET`
`pathname -> /api/profile/:username`

authentication optional
It should return user document according to above Profile specs.

### Update Profile

`method -> PUT`
`pathname -> /api/profile/:username`

authentication required
optional arguments are
username, name, bio, image, email
It should return user document according to above Profile specs.

### Create Question

`method -> POST`
`pathname -> /api/questions`

authentication required
required fields are
title
author
slug
optional fields are
description
tags
It should return the Question which was created.


### List Questions

`method -> GET`
`pathname -> /api/questions`

authentication optional
It should return an array of All Question in the above specified format.

### Update question

`method -> PUT`
`pathname -> /api/questions/:questionId`

authentication required

optional fields are

description
tags
title
It should return the Question which was updated.

### Delete Question

`method -> DELETE`
`pathname -> /api/questions/:slug`

authentication required
It should return deleted Question. It should also delete associated answers.

### Add answer

`method -> POST`
`pathname -> /api/questions/:questionId/answers`

authentication required

required fileds are

text answer
author
It should return an Answer

### List answers

`method -> GET`
`pathname -> /api/questions/:questionId/answers`
authentication required
It should return an array of answers

### Update answer

`method -> PUT`
`pathname -> /api/answers/:answerId`

authentication required
required field
answer text
It should return an Answer.

### Delete answer

`method -> DELETE`
`pathname -> /api/answers/:answerId`

authentication required
It should return deleted Answer. It should also remove the reference from other model documents.

### List tags
`method -> GET`
`pathname -> /api/tags`