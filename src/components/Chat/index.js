import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import InfoBar from '../Infobar'
import Input from '../Input'
import Messages from '../Messages'
import TextContainer from '../TextContainer'
import './Chat.css'

let socket

export default function Chat({ location }) {
	const [name, setName] = useState('')
	const [room, setRoom] = useState('')
	const [users, setUsers] = useState([])
	const [messages, setMessages] = useState([])
	const [message, setMessage] = useState('')
	// const ENDPOINT = 'localhost:5000'
	const ENDPOINT = 'https://mychat-app-server.herokuapp.com/'

	useEffect(() => {
		const { name, room } = queryString.parse(location.search)

		socket = io(ENDPOINT)

		setName(name)
		setRoom(room)

		socket.emit('join', { name, room }, (error) => {
			if (error) alert(error)
		})
		// return () => {
		// 	socket.emit('disconnect')
		// 	socket.off()
		// }
	}, [ENDPOINT, location.search])

	useEffect(() => {
		socket.on('message', (message) => {
			setMessages((messages) => [...messages, message])
		})

		socket.on('roomData', ({ room, users }) => {
			setUsers(users)
		})
	}, [])

	const sendMessage = (e) => {
		e.preventDefault()
		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''))
		}
	}

	return (
		<div className="outerContainer">
			<div className="container">
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
				/>
			</div>
			<TextContainer users={users} />
		</div>
	)
}
