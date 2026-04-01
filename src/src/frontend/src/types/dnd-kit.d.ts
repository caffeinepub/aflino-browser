declare module "@dnd-kit/core" {
  import type { ReactNode, CSSProperties } from "react";

  export interface DragStartEvent {
    active: Active;
  }

  export interface DragEndEvent {
    active: Active;
    over: Over | null;
    delta: { x: number; y: number };
  }

  export interface DragOverEvent {
    active: Active;
    over: Over | null;
  }

  export interface Active {
    id: string | number;
    data: { current?: Record<string, unknown> };
    rect: { current: { initial: DOMRect | null; translated: DOMRect | null } };
  }

  export interface Over {
    id: string | number;
    data: { current?: Record<string, unknown> };
    rect: DOMRect;
    disabled: boolean;
  }

  export interface DndContextProps {
    children?: ReactNode;
    onDragStart?: (event: DragStartEvent) => void;
    onDragEnd?: (event: DragEndEvent) => void;
    onDragOver?: (event: DragOverEvent) => void;
    onDragCancel?: () => void;
    sensors?: ReturnType<typeof useSensors>;
    collisionDetection?: CollisionDetection;
    modifiers?: Modifier[];
    measuring?: MeasuringConfiguration;
    accessibility?: { announcements?: Announcements };
  }

  export type CollisionDetection = (args: unknown) => unknown[];
  export type Modifier = (args: unknown) => unknown;
  export type MeasuringConfiguration = Record<string, unknown>;
  export type Announcements = Record<string, unknown>;

  export const DndContext: React.FC<DndContextProps>;
  export const DragOverlay: React.FC<{
    children?: ReactNode;
    style?: CSSProperties;
  }>;

  export interface SensorDescriptor<T> {
    sensor: unknown;
    options: T;
  }

  export interface PointerSensorOptions {
    activationConstraint?: {
      distance?: number;
      delay?: number;
      tolerance?: number;
    };
  }

  export interface KeyboardSensorOptions {
    coordinateGetter?: unknown;
  }

  export const PointerSensor: unknown;
  export const KeyboardSensor: unknown;
  export const MouseSensor: unknown;
  export const TouchSensor: unknown;

  export function useSensor<T>(
    sensor: unknown,
    options?: T,
  ): SensorDescriptor<T>;
  export function useSensors(
    ...sensors: SensorDescriptor<unknown>[]
  ): SensorDescriptor<unknown>[];

  export const closestCenter: CollisionDetection;
  export const closestCorners: CollisionDetection;
  export const rectIntersection: CollisionDetection;

  export function useDroppable(args: {
    id: string | number;
    data?: Record<string, unknown>;
    disabled?: boolean;
  }): {
    isOver: boolean;
    setNodeRef: (el: HTMLElement | null) => void;
    over: Over | null;
    active: Active | null;
    rect: React.MutableRefObject<DOMRect | null>;
  };

  export function useDraggable(args: {
    id: string | number;
    data?: Record<string, unknown>;
    disabled?: boolean;
  }): {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown> | undefined;
    setNodeRef: (el: HTMLElement | null) => void;
    transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
    isDragging: boolean;
    over: Over | null;
    active: Active | null;
  };
}

declare module "@dnd-kit/sortable" {
  import type { ReactNode } from "react";
  import type { Active, Over } from "@dnd-kit/core";

  export interface SortableContextProps {
    items: (string | number)[];
    strategy?: SortingStrategy;
    id?: string;
    children?: ReactNode;
    disabled?: boolean;
  }

  export type SortingStrategy = (args: unknown) => unknown;

  export const SortableContext: React.FC<SortableContextProps>;
  export const verticalListSortingStrategy: SortingStrategy;
  export const horizontalListSortingStrategy: SortingStrategy;
  export const rectSortingStrategy: SortingStrategy;
  export const rectSwappingStrategy: SortingStrategy;

  export function useSortable(args: {
    id: string | number;
    data?: Record<string, unknown>;
    disabled?: boolean;
  }): {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown> | undefined;
    setNodeRef: (el: HTMLElement | null) => void;
    transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
    transition: string | undefined;
    isDragging: boolean;
    over: Over | null;
    active: Active | null;
    isSorting: boolean;
    index: number;
    overIndex: number;
  };

  export function arrayMove<T>(array: T[], from: number, to: number): T[];
  export function arraySwap<T>(array: T[], from: number, to: number): T[];

  export function sortableKeyboardCoordinates(
    event: unknown,
    args: unknown,
  ): { x: number; y: number } | undefined;
}

declare module "@dnd-kit/utilities" {
  export const CSS: {
    Transform: {
      toString(
        transform: {
          x: number;
          y: number;
          scaleX: number;
          scaleY: number;
        } | null,
      ): string;
    };
    Transition: {
      toString(transition: {
        property: string;
        duration: number;
        easing: string;
      }): string;
    };
  };
}
