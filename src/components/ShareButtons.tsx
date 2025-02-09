import React from 'react'
import { FacebookShareButton, TwitterShareButton, RedditShareButton } from 'react-share'

const ShareButtons = () => {

    const shareUrl = "https://thehoard.github.io/"
    const title = "Jette un coup d'oeil au générateur de Minis de The hoard 👀"
    const hashtag = "#Thehoard"

    return (
        <div className={'flex justify-center items-center mb-6'}>
            <p className={'flex items-center h-full font-poppins text-xl mr-4'}>Partager :</p>
            <FacebookShareButton url={shareUrl} title={title} hashtag={hashtag} className={'flex justify-center items-center'}>
                <button>
                    <img className={'w-5/6 mx-auto'} src='assets/images/icons/facebook.svg'></img>
                </button>
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title} className={'flex justify-center items-center'}>
                <button>
                    <img className={'w-5/6 mx-auto'} src='assets/images/icons/X.svg'></img>
                </button>
            </TwitterShareButton>
            <RedditShareButton url={shareUrl} title={title} className={'flex justify-center items-center'}>
                <button>
                    <img className={'w-5/6 mx-auto'} src='assets/images/icons/reddit.svg'></img>
                </button>
            </RedditShareButton>
        </div>
    )
}

export default ShareButtons