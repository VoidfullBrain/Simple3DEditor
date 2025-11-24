import {SingleSelection as SingleSelectionEventSubscriber} from "../../../../editor/event/event-subscriber/single-selection/event-subscriber.single-selection";
import {MultiSelection as MultiSelectionEventSubscriber} from "../../../../editor/event/event-subscriber/multi-selection/event-subscriber.multi-selection";
import {SelectionCommand as SelectionCommandEventSubscriber} from "../../../../editor/event/event-subscriber/selection-command/event-subscriber.selection-command";
import {CommonKey as CommonKeyEventSubscriber} from "../../../../editor/event/event-subscriber/common-key/event-subscriber.common-key";
import {Transform as TransformEventSubscriber} from "../../../../editor/event/event-subscriber/transform/event-subscriber.transform";
import {VertexSelection as VertexSelectionEventSubscriber} from "../../../../editor/event/event-subscriber/vertex-selection/event-subscriber.vertex-selection";
import {VertexTransform as VertexTransformEventSubscriber} from "../../../../editor/event/event-subscriber/vertex-transform/event-subscriber.vertex-transform";
import {PolygonSelection as PolygonSelectionEventSubscriber} from "../../../../editor/event/event-subscriber/polygon-selection/event-subscriber.polygon-selection";
import {EdgeSelection as EdgeSelectionEventSubscriber} from "../../../../editor/event/event-subscriber/edge-selection/event-subscriber.edge-selection";

export const config = [
  {
    className: CommonKeyEventSubscriber,
    methods: [
      'addCommonKeyEventSubscriber',
    ]
  },
  {
    className: SingleSelectionEventSubscriber,
    methods: [
      'addSingleSelectionEventSubscriber',
    ]
  },
  {
    className: MultiSelectionEventSubscriber,
    methods: [
      'addMultiSelectionEventSubscriber',
    ]
  },
  {
    className: SelectionCommandEventSubscriber,
    methods: [
      'addSelectionCommandEventSubscriber',
    ]
  },
  {
    className: TransformEventSubscriber,
    methods: [
      'addTransformEventSubscriber',
    ]
  },
  {
    className: VertexSelectionEventSubscriber,
    methods: [
      'addVertexSelectionEventSubscriber',
    ]
  },
  {
    className: VertexTransformEventSubscriber,
    methods: [
      'addVertexTransformEventSubscriber',
    ]
  },
  {
    className: PolygonSelectionEventSubscriber,
    methods: [
      'addPolygonSelectionEventSubscriber',
    ]
  },
  {
    className: EdgeSelectionEventSubscriber,
    methods: [
      'addEdgeSelectionEventSubscriber',
    ]
  },
];
