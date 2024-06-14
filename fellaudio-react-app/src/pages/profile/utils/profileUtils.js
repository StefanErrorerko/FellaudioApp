export const formatInfoAboutContent = (contents) => {
    let outputMessage = 'Ще не створено жодного контенту'

    if(contents === null || contents === undefined || contents.length === 0)
      return outputMessage

    outputMessage = `${contents.length} `

    if(contents.length === 1)
      outputMessage += 'екскурсія'
    else if([2, 3, 4].includes(contents.length))
      outputMessage += 'екскурсії'
    else outputMessage += 'екскурсій'

    outputMessage += ' від користувача:'

    return outputMessage
  }