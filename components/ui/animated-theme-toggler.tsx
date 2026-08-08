"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"

type AnimatedThemeTogglerProps = React.ComponentPropsWithoutRef<"button">

export const AnimatedThemeToggler = ({
  className,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    let x: number
    let y: number
    if (e && (e.clientX || e.clientY)) {
      x = e.clientX
      y = e.clientY
    } else {
      const { top, left, width, height } = button.getBoundingClientRect()
      x = left + width / 2
      y = top + height / 2
    }

    // Drive the reveal purely via CSS custom properties + a keyframe
    // animation on ::view-transition-new(root) (see globals.css). Computing
    // the radius in JS and animating it with element.animate() at
    // transition.ready-time is what caused the reveal to originate from the
    // wrong spot on Android Chrome — the viewport can resize (dynamic
    // toolbar) between the click and the ready promise resolving, making the
    // precomputed pixel values stale. A CSS clip-path percentage sidesteps
    // that entirely.
    document.documentElement.style.setProperty("--theme-x", `${x}px`)
    document.documentElement.style.setProperty("--theme-y", `${y}px`)

    const applyTheme = () => {
      const newTheme = !isDark
      setIsDark(newTheme)
      document.documentElement.classList.toggle("dark")
      localStorage.setItem("theme", newTheme ? "dark" : "light")
    }

    if (typeof document.startViewTransition !== "function") {
      applyTheme()
      return
    }

    document.startViewTransition(() => {
      flushSync(applyTheme)
    })
  }, [isDark])

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
