import React, { useState, useEffect } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import SingleBook from './SingleBook'
import ToggleGroup from './ToggleGroup'
import fantasy from '../data/books/fantasy.json'
import romance from '../data/books/romance.json'
import history from '../data/books/history.json'
import scifi from '../data/books/scifi.json'
import horror from '../data/books/horror.json'
import BookModal from './BookModal'
import CommentModal from './CommentModal'

function BookList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [booksData, setBooksData] = useState([
    ...fantasy,
    ...romance,
    ...history,
    ...scifi,
    ...horror,
  ])
  const [selectedBookAsin, setSelectedBookAsin] = useState(null)
  const [comments, setComments] = useState([])
  const [showCommentModal, setShowCommentModal] = useState(false)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleBookSelect = (asin) => {
    setSelectedBookAsin(asin)
  }

  const handleGenreChange = (genre) => {
    const genreMap = {
      1: [...fantasy, ...romance, ...history, ...scifi, ...horror],
      2: fantasy,
      3: romance,
      4: history,
      5: scifi,
      6: horror,
    }
    setBooksData(genreMap[genre] || [])
  }

  const toggleCommentModal = () => {
    setShowCommentModal((show) => !show)
  }

  useEffect(() => {
    if (selectedBookAsin) {
      fetchComments()
    }
  }, [selectedBookAsin])

  const fetchComments = () => {
    const URL = `https://striveschool-api.herokuapp.com/api/comments/${selectedBookAsin}`
    const API_KEY =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjE4ZWFkNzdmMzA0NjAwMWFlNTlmNmIiLCJpYXQiOjE3MTQzOTU2NzIsImV4cCI6MTcxNTYwNTI3Mn0.yfjMncpvzwOYpP_vBTE0BmCHEdXvANwDaV06LcyBt3o'

    console.log('Fetching...')
    fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Fetch completed')
          return response.json()
        } else {
          throw new Error('Fetching error')
        }
      })
      .then((comments) => {
        if (comments && comments.length > 0) {
          setComments(comments)
          console.log('Fetched comments:', comments)
        } else {
          setComments([])
          console.log('There are no comments for this book')
        }
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const filteredBooks = booksData.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container>
      <Row className="search-row mt-5 mb-2">
        <Col xs={12} md={8} lg={6} xl={4} className="p-0">
          <ToggleGroup onGenreChange={handleGenreChange} />
        </Col>
        <Col xs={12} md={4} lg={6} xl={8} className="mt-3 mt-md-0 p-0">
          <Form>
            <Form.Group controlId="searchTerm">
              <div className="search-input-container">
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="Search books by title"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <div className="horizontal-scroll d-flex">
        {filteredBooks.map((book, i) => (
          <SingleBook
            key={`${book.asin}-${i}`}
            book={book}
            onSelect={handleBookSelect}
            isSelected={book.asin === selectedBookAsin}
          />
        ))}
      </div>
      <BookModal
        show={selectedBookAsin !== null}
        onHide={() => handleBookSelect(null)}
        book={filteredBooks.find((book) => book.asin === selectedBookAsin)}
        comments={comments}
        handleShowCommentModal={toggleCommentModal}
      />
      <CommentModal
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
        selectedBookAsin={selectedBookAsin}
      />
    </Container>
  )
}

export default BookList
