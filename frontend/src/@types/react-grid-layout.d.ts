declare module "react-grid-layout" {
    import { Component, ReactNode, CSSProperties } from "react";

    export interface Layout {
        i: string; // Unik id for hver widget
        x: number; // X-posisjon i rutenett
        y: number; // Y-posisjon i rutenett
        w: number; // Bredde i rutenett-enheter
        h: number; // Høyde i rutenett-enheter
        minW?: number; // Minimum bredde
        maxW?: number; // Maksimum bredde
        minH?: number; // Minimum høyde
        maxH?: number; // Maksimum høyde
        static?: boolean; // Om elementet ikke kan flyttes eller endres
    }

    export interface GridLayoutProps {
        className?: string;
        style?: CSSProperties;
        layout: Layout[];
        cols?: number;
        rowHeight?: number;
        width?: number;
        margin?: [number, number]; // Margin mellom widgets
        containerPadding?: [number, number]; // Padding for grid-container
        isDraggable?: boolean; // Om elementer kan dras
        isResizable?: boolean; // Om elementer kan endre størrelse
        resizeHandles?: ("s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne")[]; // Tilgjengelige resize-håndtak
        draggableHandle?: string; // CSS-selector for å definere drag-område
        draggableCancel?: string; // CSS-selector for å hindre drag på spesifikke elementer
        compactType?: "vertical" | "horizontal" | null; // Hvordan elementer organiseres ved drag
        preventCollision?: boolean; // Om widgets skal overlappe eller ikke
        useCSSTransforms?: boolean; // Om transform skal brukes for animasjoner
        onLayoutChange?: (layout: Layout[]) => void; // Callback når layout endres
        onDragStart?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onDrag?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onDragStop?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onResizeStart?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onResize?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onResizeStop?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        children?: ReactNode;
    }

    export default class GridLayout extends Component<GridLayoutProps> {}
}
