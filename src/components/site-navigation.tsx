"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ActivePage = "inicio" | "evalua" | "none";

export function SiteNavigation({ active }: { active: ActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <NavigationMenu aria-label="Navegación principal" className="main-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={
                <Link
                  aria-current={active === "inicio" ? "page" : undefined}
                  href="/"
                />
              }
            >
              Inicio
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link href="/#nosotros" />}>
              Nosotros
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button
              className="header-cta"
              nativeButton={false}
              render={
                <Link
                  aria-current={active === "evalua" ? "page" : undefined}
                  href="/evalua-tu-caso"
                />
              }
              variant="secondary"
            >
              Evalúa tu caso
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Sheet onOpenChange={setMenuOpen} open={menuOpen}>
        <SheetTrigger
          render={
            <Button
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="mobile-menu-trigger"
              size="icon-lg"
              variant="outline"
            />
          }
        >
          <MenuIcon aria-hidden="true" />
        </SheetTrigger>
        <SheetContent className="mobile-menu-panel" side="right">
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <NavigationMenu aria-label="Navegación móvil" className="mobile-nav">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={
                    <Link
                      aria-current={active === "inicio" ? "page" : undefined}
                      href="/"
                      onClick={() => setMenuOpen(false)}
                    />
                  }
                >
                  Inicio
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={
                    <Link
                      href="/#nosotros"
                      onClick={() => setMenuOpen(false)}
                    />
                  }
                >
                  Nosotros
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            className="mobile-menu-cta"
            nativeButton={false}
            render={
              <Link
                aria-current={active === "evalua" ? "page" : undefined}
                href="/evalua-tu-caso"
                onClick={() => setMenuOpen(false)}
              />
            }
          >
            Evalúa tu caso
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
