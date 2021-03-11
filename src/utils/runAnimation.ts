interface CurComponent {
  animations?: Array<string>
  animationConfig?: AnimationConfig
}
interface AnimationConfig {
  animationDuration: number
  animationDelay: number
}

export default function runAnimation($el:HTMLElement, curComponent: CurComponent) {    
  // store.commit('increaseShapeKey')
  const $ele = $el.children[0]
  if ($ele) {    
    const { animations = [] } = curComponent
    // 记录动画执行到第几个 0 表示第一个
    let countFlag = 0
    const len = animations.length
  
    const play = (animation:any, index:number) => {
      if (countFlag >= len ) {
        return
      }
      const animationStyle = `${animation.animationDelay ?  animation.animationDelay + 's' : ' '} 
                            ${animation.value} ${animation.animationDuration}s ease-in-out  
                            ${animation.count === -1 ? 'infinite' : animation.count} ${index === len-1 ? 'both' : 'forwards'}`
      $ele.style.animation = animationStyle
    
      countFlag++
      $ele.addEventListener('animationend', ()=>{    
        $ele.style.animation = ''
        play(animations[countFlag], countFlag)      
      })
    }

    play(animations[countFlag], countFlag)
  }
  
}
