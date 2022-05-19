import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
		<header>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/private/">Private</Link>
					</li>
				</ul>
				<ul>
					<li>
						<Link to="/login/">Log In</Link>
					</li>
					<li>
						<Link to="/register/">Sign In</Link>
					</li>
				</ul>
			</nav>
		</header>
  )
}

export default Header