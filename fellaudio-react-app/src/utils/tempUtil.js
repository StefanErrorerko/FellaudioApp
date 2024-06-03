import Lukianivka from '../assets/lukianivka.jpg'
import LysaHora from '../assets/lysa.jpg'
import Schekavytsia from '../assets/schek.jpg'
import Salut from '../assets/salut.jpg'
import KadGai from '../assets/soloma.jpg'
import HostDvir from '../assets/host.jpg'
import Avariine from '../assets/avariine.jpg'
import Sich from '../assets/sichovykh.webp'

export function FillContentWithImages(contents) {
  contents.forEach(content => {
    if(content.id === 5)
        content.image = Lukianivka 
    if(content.id === 6)
        content.image = LysaHora 
    if(content.id === 1)
        content.image = Schekavytsia
    if(content.id === 3)
        content.image = Salut
    if(content.id === 4)
        content.image = KadGai
    if(content.id === 8)
        content.image = HostDvir
    if(content.id === 9)
        content.image = Sich
    if(content.id === 10)
        content.image = Avariine
  });

  return contents
}

