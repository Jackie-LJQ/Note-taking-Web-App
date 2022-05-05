import './home.css'
import Posts from '../components/posts'
import Header from '../components/header'

export default function Home({user}){
    return (
        <>
        <Header user={user} />
        <div className="home">            
            <Posts />
        </div>
        </>
    )
}