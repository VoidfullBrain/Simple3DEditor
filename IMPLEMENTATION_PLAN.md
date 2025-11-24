# Implementierungsplan: Vollständiges Selektions- und Transform-System

## Übersicht
Implementierung eines mehrstufigen Selektionssystems mit 4 Modi (Geometry, Polygon, Edge, Point) und vollständiger Transform-Unterstützung (Translate, Rotate, Scale) für alle Modi.

---

## Phase 1: Farbsystem und Material-Management (Priorität: HOCH)
**Geschätzter Aufwand:** 4-6 Stunden
**Dateien:** ~150 Zeilen Code

### 1.1 Material-Konfiguration erstellen
**Datei:** `src/app/config/editor/material/selection-materials/config.ts`
```typescript
- Unselektiertes Material: Orange (#FF8C00)
- Selektiertes Material: Grün (#00FF00)
- Verschiedene Opazitäten für verschiedene Modi
```

### 1.2 Material-Service erweitern
**Datei:** `src/app/editor/service/service.material.ts` (neu)
```typescript
- getMaterialForSelectionState(selected: boolean, type: SelectionType)
- updateObjectMaterial(object: THREE.Mesh, selected: boolean)
- resetAllMaterials()
- applySelectionColor(elements: Array, selected: boolean)
```

### 1.3 Vertex-Service aktualisieren
**Datei:** `src/app/editor/service/service.vertex.ts`
```typescript
- Vertex-Material: Orange → Grün
- updateVertexColors() Methode
- Material-Farben dynamisch anpassen
```

### Akzeptanzkriterien:
✅ Unselektierte Vertices sind orange
✅ Selektierte Vertices sind grün
✅ Material-Wechsel funktioniert flüssig
✅ Keine Performance-Einbußen

---

## Phase 2: Selektions-Einschränkungen nach Modus (Priorität: HOCH)
**Geschätzter Aufwand:** 3-4 Stunden
**Dateien:** ~200 Zeilen Code

### 2.1 Selection-Service erweitern
**Datei:** `src/app/editor/service/service.selection.ts`
```typescript
- canSelectObject(object: THREE.Object3D, mode: SelectionType): boolean
- filterSelectableObjects(objects: Array, mode: SelectionType)
- Mode-spezifische Selektion implementieren
```

### 2.2 Event-Handler aktualisieren

#### Single-Selection Handler
**Datei:** `src/app/editor/event/event-handler/single-selection/event-handler.single-selection.ts`
```typescript
- Prüfung: Nur in Geometry-Modus normale Objekte auswählen
- Raycasting nur auf erlaubte Objekte
- Andere Modi ignorieren Object-Selection
```

#### Vertex-Selection Handler
**Datei:** `src/app/editor/event/event-handler/vertex-selection/event-handler.vertex-selection.ts`
```typescript
- Nur in Point-Modus aktiv
- In anderen Modi deaktiviert
```

### 2.3 Multi-Selection Handler
**Datei:** `src/app/editor/event/event-handler/multi-selection/event-handler.multi-selection.ts`
```typescript
- Mode-Checking bei Box-Selection
- Nur passende Objekte/Elemente auswählen
```

### Akzeptanzkriterien:
✅ Point-Modus: Nur Vertices selektierbar
✅ Geometry-Modus: Nur ganze Objekte selektierbar
✅ Andere Modi: Objekt-Selektion blockiert
✅ Visuelles Feedback korrekt

---

## Phase 3: Edge-Service und Edge-Selektion (Priorität: HOCH)
**Geschätzter Aufwand:** 6-8 Stunden
**Dateien:** ~350 Zeilen Code

### 3.1 Edge-Service erstellen
**Datei:** `src/app/editor/service/service.edge.ts` (neu)
```typescript
class Edge {
  // Datenstrukturen
  - selectedEdges: Array<{vertexA: number, vertexB: number, object: THREE.Mesh}>
  - edgeHelpers: Map<string, THREE.Line>

  // Methoden
  - showEdgesForAllObjects()
  - showEdges(object: THREE.Mesh)
  - hideAllEdges()
  - selectEdge(mouse: THREE.Vector2, multiSelect: boolean): boolean
  - deselectAllEdges()
  - getAverageEdgePosition(): THREE.Vector3
  - updateEdgePositions(offset: THREE.Vector3)
  - highlightEdge(vertexA: number, vertexB: number, selected: boolean)
}
```

### 3.2 Edge-Erkennung implementieren
```typescript
- Kanten aus BufferGeometry extrahieren
- Index-basierte Kanten-Paare erstellen
- Duplikate entfernen (Edge = [v1,v2] = [v2,v1])
- Edge-LineSegments erstellen
```

### 3.3 Edge-Highlighting
```typescript
- Orange Line für unselektierte Kanten
- Grüne, dickere Line für selektierte Kanten
- Line-Material: LineBasicMaterial mit angepasster linewidth
```

### 3.4 Edge-Transform-Service
**Datei:** `src/app/editor/service/service.edge-transform.ts` (neu)
```typescript
- startDrag(mouse: THREE.Vector2, axis: AxisEnum)
- translate(mouse: THREE.Vector2, axis: AxisEnum)
- endDrag()
- showEdgeAxes()
- hideEdgeAxes()
- updateEdgeAxesPosition()
```

### 3.5 Event-Handler für Edge-Selection
**Datei:** `src/app/editor/event/event-handler/edge-selection/event-handler.edge-selection.ts` (neu)
```typescript
- mouseClick: Edge-Selektion mit Shift-Support
- Raycasting auf Edge-Lines
- Helper-Pfeile bei Selektion anzeigen
```

### 3.6 Event-Handler für Edge-Transform
**Datei:** `src/app/editor/event/event-handler/edge-transform/event-handler.edge-transform.ts` (neu)
```typescript
- mouseDown: Achsen-Selektion
- mouseMove: Edge verschieben
- mouseUp: Transform beenden
- Geometrie-Deformation bei Edge-Bewegung
```

### Akzeptanzkriterien:
✅ Alle Kanten als orange Linien sichtbar
✅ Kanten können angeklickt werden
✅ Selektierte Kanten sind grün und dicker
✅ Multi-Selektion mit Shift funktioniert
✅ Helper-Pfeile erscheinen an Durchschnittsmittelpunkt
✅ Kanten-Bewegung deformiert Geometrie korrekt

---

## Phase 4: Polygon-Service und Polygon-Selektion (Priorität: MITTEL)
**Geschätzter Aufwand:** 8-10 Stunden
**Dateien:** ~400 Zeilen Code

### 4.1 Polygon-Service erstellen
**Datei:** `src/app/editor/service/service.polygon.ts` (neu)
```typescript
class Polygon {
  // Datenstrukturen
  - selectedPolygons: Array<{indices: number[], object: THREE.Mesh}>
  - polygonHelpers: Map<string, THREE.Group>

  // Methoden
  - showPolygonsForAllObjects()
  - showPolygons(object: THREE.Mesh)
  - hideAllPolygons()
  - selectPolygon(mouse: THREE.Vector2, multiSelect: boolean): boolean
  - deselectAllPolygons()
  - getAveragePolygonPosition(): THREE.Vector3
  - updatePolygonPositions(offset: THREE.Vector3)
  - highlightPolygonEdges(indices: number[], selected: boolean)
}
```

### 4.2 Polygon-Erkennung
```typescript
- Faces aus BufferGeometry extrahieren
- Bei Indexed Geometry: Dreiecke aus Index-Array
- Bei Non-Indexed: Jeweils 3 Vertices = 1 Face
- Face-Normalen berechnen
- Transparentes Mesh für Raycasting erstellen
```

### 4.3 Polygon-Edge-Highlighting
```typescript
- Nur die 3 Kanten des selektierten Dreiecks highlighten
- Orange → unselektiert
- Grün, dicker → selektiert
- LineSegments für jede Polygon-Kante
```

### 4.4 Polygon-Transform-Service
**Datei:** `src/app/editor/service/service.polygon-transform.ts` (neu)
```typescript
- startDrag(mouse: THREE.Vector2, axis: AxisEnum)
- translate(mouse: THREE.Vector2, axis: AxisEnum)
- rotate(mouse: THREE.Vector2, axis: AxisEnum)
- scale(mouse: THREE.Vector2, axis: AxisEnum)
- endDrag()
- showPolygonAxes()
- hidePolygonAxes()
```

### 4.5 Event-Handler für Polygon-Selection
**Datei:** `src/app/editor/event/event-handler/polygon-selection/event-handler.polygon-selection.ts` (neu)
```typescript
- mouseClick: Polygon-Selektion
- Raycasting auf Polygon-Meshes
- Multi-Selektion mit Shift
```

### 4.6 Event-Handler für Polygon-Transform
**Datei:** `src/app/editor/event/event-handler/polygon-transform/event-handler.polygon-transform.ts` (neu)
```typescript
- mouseDown: Achsen-Selektion
- mouseMove: Polygon transformieren
- mouseUp: Transform beenden
- Alle 3 Transform-Modi unterstützen
```

### Akzeptanzkriterien:
✅ Polygone können per Raycasting selektiert werden
✅ Nur die Kanten des selektierten Polygons sind grün
✅ Nicht-selektierte bleiben orange
✅ Multi-Selektion funktioniert
✅ Helper-Pfeile erscheinen am Polygon-Zentrum
✅ Polygon-Bewegung funktioniert

---

## Phase 5: Transform-System für alle Modi (Priorität: HOCH)
**Geschätzter Aufwand:** 10-12 Stunden
**Dateien:** ~500 Zeilen Code

### 5.1 Transform-Service Abstraktion
**Datei:** `src/app/editor/service/abstract.transform-service.ts` (neu)
```typescript
abstract class AbstractTransformService {
  abstract translate(mouse: THREE.Vector2, axis: AxisEnum)
  abstract rotate(mouse: THREE.Vector2, axis: AxisEnum)
  abstract scale(mouse: THREE.Vector2, axis: AxisEnum)
  abstract showAxes()
  abstract hideAxes()

  // Gemeinsame Methoden
  protected calculateAxisMovement(...)
  protected createAxesHelper(...)
}
```

### 5.2 Point-Transform erweitern
**Datei:** `src/app/editor/service/service.vertex-transform.ts`
```typescript
- rotate() implementieren
- scale() implementieren
- Rotation um Durchschnittsmittelpunkt
- Skalierung von Durchschnittsmittelpunkt
```

### 5.3 Edge-Transform erweitern
**Datei:** `src/app/editor/service/service.edge-transform.ts`
```typescript
- rotate() implementieren
- scale() implementieren
- Edge-Deformation bei allen Transforms
```

### 5.4 Polygon-Transform erweitern
**Datei:** `src/app/editor/service/service.polygon-transform.ts`
```typescript
- rotate() implementieren
- scale() implementieren
- Polygon-Deformation bei allen Transforms
```

### 5.5 Transform-Mode-Handling
**Datei:** `src/app/editor/service/service.transform.ts`
```typescript
- getCurrentTransformService(): AbstractTransformService
- switchTransformMode(mode: TransformEnum)
- applyTransformToSelection(mode: TransformEnum)
```

### 5.6 Transform-Event-Handler aktualisieren
**Dateien:**
- `event-handler.vertex-transform.ts`
- `event-handler.edge-transform.ts`
- `event-handler.polygon-transform.ts`

```typescript
Für jeden:
- Translate-Handler
- Rotate-Handler
- Scale-Handler
- Mode-Switch bei Button-Click
```

### Akzeptanzkriterien:
✅ Translate funktioniert für Point/Edge/Polygon/Object
✅ Rotate funktioniert für Point/Edge/Polygon/Object
✅ Scale funktioniert für Point/Edge/Polygon/Object
✅ Transform-Buttons switchen korrekt zwischen Modi
✅ Geometrie wird korrekt deformiert
✅ Keine Artefakte oder Glitches

---

## Phase 6: Event-Subscriber aktualisieren (Priorität: MITTEL)
**Geschätzter Aufwand:** 2-3 Stunden
**Dateien:** ~150 Zeilen Code

### 6.1 Event-Subscriber erstellen

#### Edge-Selection-Subscriber
**Datei:** `src/app/editor/event/event-subscriber/edge-selection/event-subscriber.edge-selection.ts` (neu)
```typescript
- mouseClick Subscription
- Event an EdgeSelectionHandler weiterleiten
```

#### Edge-Transform-Subscriber
**Datei:** `src/app/editor/event/event-subscriber/edge-transform/event-subscriber.edge-transform.ts` (neu)
```typescript
- mouseDown Subscription
- mouseMove Subscription
- mouseUp Subscription
```

#### Polygon-Selection-Subscriber
**Datei:** `src/app/editor/event/event-subscriber/polygon-selection/event-subscriber.polygon-selection.ts` (neu)
```typescript
- mouseClick Subscription
```

#### Polygon-Transform-Subscriber
**Datei:** `src/app/editor/event/event-subscriber/polygon-transform/event-subscriber.polygon-transform.ts` (neu)
```typescript
- mouseDown Subscription
- mouseMove Subscription
- mouseUp Subscription
```

### 6.2 Event-Subscriber Config
**Datei:** `src/app/config/editor/event/event-subscriber/config.ts`
```typescript
- Neue Subscriber hinzufügen
- Richtige Reihenfolge sicherstellen
```

### Akzeptanzkriterien:
✅ Alle Events werden korrekt geroutet
✅ Keine Event-Konflikte
✅ Subscriber können aktiviert/deaktiviert werden

---

## Phase 7: Wireframe und Edge-Rendering (Priorität: MITTEL)
**Geschätzter Aufwand:** 4-5 Stunden
**Dateien:** ~200 Zeilen Code

### 7.1 Wireframe-Service erweitern
**Datei:** `src/app/editor/service/service.wireframe.ts` (neu)
```typescript
- createWireframeForMode(object: THREE.Mesh, mode: SelectionType)
- updateWireframeColors(selected: boolean)
- Geometry-Mode: Alle Edges orange
- Polygon-Mode: Alle Edges orange, selektierte grün
- Edge-Mode: Alle Edges orange, selektierte grün + dick
- Point-Mode: Nur Vertices sichtbar
```

### 7.2 Rendering-Pipeline anpassen
```typescript
- Mode-Switch aktualisiert Wireframe
- Selektion aktualisiert Farben
- Performance-Optimierung für viele Edges
```

### Akzeptanzkriterien:
✅ Wireframe wechselt korrekt mit Modus
✅ Farben ändern sich bei Selektion
✅ Performance bleibt gut (>30 FPS)

---

## Phase 8: Integration und Testing (Priorität: HOCH)
**Geschätzter Aufwand:** 6-8 Stunden
**Dateien:** Bestehende Dateien

### 8.1 Integration aller Services
```typescript
- Services in Editor registrieren
- Abhängigkeiten auflösen
- Initialisierung in korrekter Reihenfolge
```

### 8.2 Mode-Switching testen
```typescript
- Geometry → Point → Edge → Polygon
- Selektion bleibt erhalten oder wird gecleared
- Visuals aktualisieren korrekt
```

### 8.3 Transform-Testing
```typescript
- Jeder Transform-Modus in jedem Selection-Modus
- Kombinationen: 4 Selection × 3 Transform = 12 Kombinationen
- Edge-Cases testen
```

### 8.4 Performance-Optimierung
```typescript
- Object-Pooling für Helpers
- Raycasting-Optimierung
- Material-Sharing
- Geometry-Update-Batching
```

### 8.5 Bug-Fixing
```typescript
- Memory-Leaks fixen
- Event-Handler-Konflikte lösen
- Rendering-Issues beheben
- Edge-Cases abdecken
```

### Akzeptanzkriterien:
✅ Alle 4 Selektionsmodi funktionieren
✅ Alle 3 Transform-Modi funktionieren in allen Selektionsmodi
✅ Keine Crashes oder Errors
✅ Performance: >30 FPS mit 10+ Objekten
✅ Farbsystem funktioniert durchgehend
✅ Multi-Selektion funktioniert überall

---

## Gesamt-Zeitplan

| Phase | Beschreibung | Aufwand | Priorität |
|-------|--------------|---------|-----------|
| **1** | Farbsystem und Material-Management | 4-6h | HOCH |
| **2** | Selektions-Einschränkungen | 3-4h | HOCH |
| **3** | Edge-Service und Edge-Selektion | 6-8h | HOCH |
| **4** | Polygon-Service und Polygon-Selektion | 8-10h | MITTEL |
| **5** | Transform-System für alle Modi | 10-12h | HOCH |
| **6** | Event-Subscriber aktualisieren | 2-3h | MITTEL |
| **7** | Wireframe und Edge-Rendering | 4-5h | MITTEL |
| **8** | Integration und Testing | 6-8h | HOCH |

**Gesamt:** 43-56 Stunden (ca. 1-1.5 Wochen Full-Time Development)

---

## Technische Herausforderungen

### 1. Edge-Selektion
- **Problem:** Kanten sind nur Linien zwischen 2 Vertices, keine physischen Objekte
- **Lösung:** LineSegments mit Raycasting-fähigem Material erstellen

### 2. Polygon-Selektion
- **Problem:** Faces sind keine separaten Objekte in BufferGeometry
- **Lösung:** Pro Face ein transparentes Mesh für Raycasting

### 3. Geometrie-Deformation
- **Problem:** Vertex-Updates müssen Normals, Bounds neu berechnen
- **Lösung:** `geometry.computeVertexNormals()`, `computeBoundingBox()`, `needsUpdate = true`

### 4. Transform-Koordinaten
- **Problem:** World-Space vs. Local-Space Transformationen
- **Lösung:** Matrix-Transformationen für korrekte Koordinaten-Umrechnung

### 5. Performance
- **Problem:** Viele Helper-Objekte belasten Rendering
- **Lösung:** Object-Pooling, Instancing, nur sichtbare Helpers rendern

---

## Dateistruktur (Neu/Geändert)

```
src/app/
├── config/
│   └── editor/
│       └── material/
│           └── selection-materials/
│               └── config.ts (NEU)
├── editor/
│   ├── service/
│   │   ├── abstract.transform-service.ts (NEU)
│   │   ├── service.edge.ts (NEU)
│   │   ├── service.edge-transform.ts (NEU)
│   │   ├── service.polygon.ts (NEU)
│   │   ├── service.polygon-transform.ts (NEU)
│   │   ├── service.material.ts (NEU)
│   │   ├── service.wireframe.ts (NEU)
│   │   ├── service.vertex.ts (ERWEITERT)
│   │   ├── service.vertex-transform.ts (ERWEITERT)
│   │   └── service.selection.ts (ERWEITERT)
│   └── event/
│       ├── event-handler/
│       │   ├── edge-selection/ (NEU)
│       │   │   └── event-handler.edge-selection.ts
│       │   ├── edge-transform/ (NEU)
│       │   │   └── event-handler.edge-transform.ts
│       │   ├── polygon-selection/ (NEU)
│       │   │   └── event-handler.polygon-selection.ts
│       │   ├── polygon-transform/ (NEU)
│       │   │   └── event-handler.polygon-transform.ts
│       │   ├── single-selection/ (ERWEITERT)
│       │   └── vertex-selection/ (ERWEITERT)
│       └── event-subscriber/
│           ├── edge-selection/ (NEU)
│           ├── edge-transform/ (NEU)
│           ├── polygon-selection/ (NEU)
│           └── polygon-transform/ (NEU)
└── enum/
    └── enum.selection-type.ts (ERWEITERT)
```

---

## Dependencies und Requirements

### Bestehende Dependencies
- Three.js (bereits vorhanden)
- Angular (bereits vorhanden)
- TypeScript (bereits vorhanden)

### Keine neuen Dependencies erforderlich

---

## Nächste Schritte

1. **Phase 1 starten:** Farbsystem implementieren
2. **Approval einholen:** Farben und Material-Design bestätigen lassen
3. **Phase 2-3:** Kritische Selektions-Features
4. **Milestone 1 erreichen:** Point + Edge Selection funktioniert
5. **Phase 4-5:** Polygon und Transform
6. **Milestone 2 erreichen:** Alle Selections funktionieren
7. **Phase 6-8:** Polish und Integration
8. **Final Release:** Vollständiges System

---

## Risiken und Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Performance-Probleme | Mittel | Hoch | Frühzeitiges Profiling, Object-Pooling |
| Komplexe Koordinaten-Transforms | Hoch | Mittel | Unit-Tests für Matrix-Ops, schrittweise Entwicklung |
| Event-Handler-Konflikte | Mittel | Mittel | Klare Prioritäten, Mode-Checking |
| Geometrie-Corruption | Niedrig | Hoch | Backup-Geometries, Undo-System |
| Scope Creep | Hoch | Hoch | Strikte Phasen-Einhaltung, kein Feature-Creep |

---

## Erfolgskriterien

✅ Alle 4 Selektionsmodi funktionieren fehlerfrei
✅ Alle 3 Transform-Modi in allen Selektionsmodi
✅ Farbsystem durchgängig korrekt (Orange/Grün)
✅ Multi-Selektion in allen Modi
✅ Performance: >30 FPS
✅ Keine Memory-Leaks
✅ Intuitive UX
✅ Keine Breaking Changes an bestehender Funktionalität

---

*Ende des Implementierungsplans*
