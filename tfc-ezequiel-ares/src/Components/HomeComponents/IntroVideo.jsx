import React from 'react'

export const IntroVideo = () => {
  return (
    <section className='main__intro'>

      <video className='main__intro__video' id='videoTitulo' src="videoIndex.webm" autoPlay={true} muted={true} loop={true}>
        Tu navegador no soporta el formato de video
      </video>

      <div className='main__intro__titulo'>
        <h1 className='main__intro__titulo_texto'>Looking recipes?</h1>
      </div>

    </section>
  )
}
