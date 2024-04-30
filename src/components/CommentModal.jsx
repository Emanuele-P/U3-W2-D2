import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

function CommentModal(props) {
  const [comment, setComment] = useState({
    comment: '',
    rate: 1,
    elementId: props.selectedBookAsin,
  })

  const sendComment = (event) => {
    event.preventDefault()
    console.log('Sending comment:', JSON.stringify(comment))

    const URL = `https://striveschool-api.herokuapp.com/api/comments/`
    const API_KEY =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjE4ZWFkNzdmMzA0NjAwMWFlNTlmNmIiLCJpYXQiOjE3MTQzOTU2NzIsImV4cCI6MTcxNTYwNTI3Mn0.yfjMncpvzwOYpP_vBTE0BmCHEdXvANwDaV06LcyBt3o'

    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEY,
      },
      body: JSON.stringify(comment),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Fetch error')
        }
      })
      .then((data) => {
        console.log('Comment added successfully', data)
        alert('Comment added successfully')
        props.refreshComments()
      })
      .catch((error) => {
        console.error('Error adding comment:', error)
        alert(`Error adding comment: ${error.message}`)
      })
      .finally(() => {
        props.onHide()
      })
  }

  useEffect(() => {
    setComment((prev) => ({ ...prev, elementId: props.selectedBookAsin }))
  }, [props.selectedBookAsin])

  return (
    <Modal show={props.show} onHide={props.onHide} className="comment-modal">
      <Modal.Header>
        <Modal.Title>Leave a Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Your Opinion:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment.comment}
              onChange={(event) =>
                setComment({
                  ...comment,
                  comment: event.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Rating:</Form.Label>
            <Form.Control
              as="select"
              value={comment.rate}
              onChange={(event) =>
                setComment({
                  ...comment,
                  rate: event.target.value,
                })
              }
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={props.onHide}>
          Discard
        </Button>
        <Button variant="primary" onClick={sendComment}>
          Send Comment
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CommentModal
