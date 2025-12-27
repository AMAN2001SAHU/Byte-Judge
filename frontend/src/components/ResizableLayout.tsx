import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export function HorizontalSplit({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={50} minSize={25}>
        {left}
      </Panel>

      <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 cursor-col-resize" />

      <Panel defaultSize={50} minSize={25}>
        {right}
      </Panel>
    </PanelGroup>
  );
}

export function VerticalSplit({
  top,
  bottom,
  collapsible = true,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
  collapsible?: boolean;
}) {
  return (
    <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={70} minSize={30}>
        {top}
      </Panel>

      <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 cursor-row-resize" />

      <Panel defaultSize={30} minSize={10} collapsible={collapsible}>
        {bottom}
      </Panel>
    </PanelGroup>
  );
}
