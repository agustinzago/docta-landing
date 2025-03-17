'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { Database, GitBranch, LucideMousePointerClick, Menu, X } from 'lucide-react'
import { menuOptions } from '@/lib/constant'
import { ModeToggle } from '../global/mode-toggle'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const MenuOptions = () => {
  const pathName = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Detectar pantalla móvil
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Verificar tamaño inicial
    checkScreenSize()
    
    // Añadir listener para redimensionamiento
    window.addEventListener('resize', checkScreenSize)
    
    // Limpiar listener
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // Menú de navegación para pantallas grandes
  const DesktopMenu = () => (
    <nav className="h-screen overflow-auto justify-between flex items-center flex-col gap-10 py-6 px-2">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link
          className="flex font-bold flex-row"
          href="/"
        >
          <Image 
            src="/images/antlogo.svg" 
            alt="Docta Solutions Logo" 
            width={60} 
            height={58}
          />
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        'group h-6 w-6 flex items-center justify-center scale-[1.5] rounded-lg p-[3px] cursor-pointer',
                        {
                          'dark:bg-primary bg-white': pathName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        <Separator />
        <div className="flex items-center flex-col gap-9 dark:bg-[#353346]/30 py-4 px-2 rounded-full h-56 overflow-auto border-[1px]">
          <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
            <LucideMousePointerClick
              className="dark:text-white"
              size={18}
            />
            <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
          </div>
          <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
            <GitBranch
              className="text-muted-foreground"
              size={18}
            />
            <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"></div>
          </div>
          <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
            <Database
              className="text-muted-foreground"
              size={18}
            />
            <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"></div>
          </div>
          <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
            <GitBranch
              className="text-muted-foreground"
              size={18}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col gap-8">
        <ModeToggle />
      </div>
    </nav>
  )

  // Menú de navegación para móviles
  const MobileMenu = () => (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-background border-b">
        <Link href="/">
          <Image 
            src="/images/antlogo.svg" 
            alt="Docta Solutions Logo" 
            width={40} 
            height={38}
          />
        </Link>
        
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full py-6">
                <div className="flex justify-between items-center mb-6">
                  <Image 
                    src="/images/antlogo.svg" 
                    alt="Docta Solutions Logo" 
                    width={40} 
                    height={38}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-4 flex-1">
                  {menuOptions.map((menuItem) => (
                    <Link
                      key={menuItem.name}
                      href={menuItem.href}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors',
                        {
                          'bg-muted font-medium': pathName === menuItem.href,
                        }
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <menuItem.Component className="h-5 w-5" />
                      <span>{menuItem.name}</span>
                    </Link>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <p className="text-sm font-medium px-4">Workflow Steps</p>
                  <div className="space-y-2 px-4">
                    <div className="flex items-center gap-3 py-2">
                      <div className="p-1.5 bg-muted rounded-full">
                        <LucideMousePointerClick className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Trigger</span>
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <div className="p-1.5 bg-muted rounded-full">
                        <GitBranch className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Branch</span>
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <div className="p-1.5 bg-muted rounded-full">
                        <Database className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Data</span>
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <div className="p-1.5 bg-muted rounded-full">
                        <GitBranch className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Action</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Espaciado para compensar la barra fija */}
      <div className="h-[60px]" />
    </>
  )

  return isMobile ? <MobileMenu /> : <DesktopMenu />
}

export default MenuOptions