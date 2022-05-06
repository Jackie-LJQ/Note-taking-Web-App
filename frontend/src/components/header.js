import './header.css'

export default function Header({user}) {
  const username = localStorage.getItem("name");
  return (
    <div className="header">
        <div className="headerTitles">
            <span className="headerTitleSmall">{`${username}`}, Welcome Home!</span>
        </div>
    </div>
  )
}
