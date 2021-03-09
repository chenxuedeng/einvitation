interface CurComponent {
  animations?: Array<string>
  animationConfig?: AnimationConfig
}
interface AnimationConfig {
  animationDuration: number
  animationDelay: number
}

export default async function runAnimation($el:HTMLElement, curComponent: CurComponent) {  
  const { animations = [] } = curComponent
  const play = (animation:any) => new Promise<void>(resolve => {
    $el.classList.add(animation.value, 'animated')
    // 设置 持续时间和延迟时间
    $el.style.animationDuration = animation?.animationDuration + 's'
    $el.style.animationDelay = animation?.animationDelay + 's'
        
    const removeAnimation = () => {
      // $el.removeEventListener('animationend', removeAnimation)
      // $el.removeEventListener('animationcancel', removeAnimation)
      $el.classList.remove(animation.value, 'animated')
      resolve()
    }
            
    $el.addEventListener('animationend', removeAnimation)
    $el.addEventListener('animationcancel', removeAnimation)
  })

  for (let i = 0, len = animations.length; i < len; i++) {
    await play(animations[i])
  }
}
