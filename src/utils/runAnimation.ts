import { watch } from "vue"

interface CurComponent {
  animations?: Array<string>
  animationConfig?: AnimationConfig
}
interface AnimationConfig {
  animationDuration: number
  animationDelay: number
}
export default function runAnimation($el:HTMLElement, curComponent: CurComponent) {  
  console.log($el)
  const { animations = [] } = curComponent
  // 记录动画执行到第几个 0 表示第一个
  let countFlag = 0
  const len = animations.length
  const play = (animation:any, index:number) => {
    if (countFlag >= len ) {
      $el.style.animation = ''
      return
    }
    const animationStyle = `${animation.animationDelay ?  animation.animationDelay + 's' : ' '} 
                            ${animation.value} ${animation.animationDuration}s ease-in-out  
                            ${animation.count === -1 ? 'infinite' : animation.count} ${index === len-1 ? 'forwards' : 'both'}`
    $el.style.animation = animationStyle
    
    countFlag++
    $el.addEventListener('animationend', ()=>{
      play(animations[countFlag], countFlag)      
    })
  }

  play(animations[countFlag], countFlag)
  
}
