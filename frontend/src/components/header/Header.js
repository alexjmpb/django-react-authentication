import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = () => {
	const user = useSelector(state => state.auth.user);
	const isAuth = useSelector(state => state.auth.isAuth)

  return (
		<header className="header">
			<nav className="nav">
				<ul className="nav__links">
					<li className="nav__link">
						<Link to="/" className="link">Home</Link>
					</li>
					<li className="nav__link">
						<Link to="/private/" className="link">Private</Link>
					</li>
				</ul>
				{
					!isAuth ?
						<ul className="nav__auth">
							<li className="nav__link">
								<Link to="/login/" className="link">Log In</Link>
							</li>
							<li className="nav__link">
								<Link to="/register/" className="link">Sign In</Link>
							</li>
						</ul>
					:
						<div className="user">
							<Link to="/private/profile/" className="link">
								<h3 className="user__username">{user.username}</h3>
							</Link>
							<Link to="/logout/" className="link logout">Log Out</Link>
						</div>
				}
				
			</nav>
		</header>
  )
}

export default Header