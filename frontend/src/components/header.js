import './header.css'

export default function Header({user}) {
  return (
    <div className="header">
        <div className="headerTitles">
            <span className="headerTitleSmall">{user}, Welcome Home!</span>
        </div>
    </div>
  )
}
