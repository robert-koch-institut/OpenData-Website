Dokumentation
# OpenData-Website

[Robert Koch-Institut](https://grid.ac/institutes/grid.13652.33) | RKI  
Nordufer 20  
13353 Berlin  

[Hannes Wuensche](https://orcid.org/0000-0002-8837-0326)  
[Pia Rissom]()  
[Fabian Eckelmann](https://github.com/eckelmannf)  
MF4 | Informations- und Forschungsdatenmanagement  

---

Wuensche, Hannes; Rissom, Pia; Eckelmann, Fabian (2022): OpenData-Website, Berlin: Zenodo. DOI:[10.5281/zenodo.XXXXX](https://doi.org/10.5281/zenodo.XXXX).  
Das GitHub Repository "OpenData-Website" ist lizenziert unter der [MIT License](https://mit-license.org/).   

## Einleitung 

Das [RKI](https.//www.rki.de) stellt in GitHub [offene Datensätze](https://github.com/robert-koch-institut/) zur Nachnutzung bereit. Für mit GitHub weniger vertraute Nutzer:innen stellt die Nutzung von GitHub jedoch teilweise eine Herausfoderung dar. Um diesen einen niederschwelligen Zugang zu den bereitgestellten Daten und Kontextinformationen zu bieten, haben wir auf Basis von GitHub-Actions ein Deployment von Datensatz eigenen Websites über GitHub-Pages entwickelt. Die Datensatz-Websites orientiert sich an der Cooperate Identity des RKI, ermöglicht das einfache Herunterladen von Daten und das schnelle erfassen der Datensatzdokumentation. Für die FAIRness der Nachnutzung werden ebenfalls Kernelement, wie Lizenz und Zitationsinformationen, angezeigt. 

Das Repository stellt eine Action und den zugehörigen Quellcode für die Erzeugung und Veröffentlichung von Datensatz-Websites des RKIs bereit. Es handelt sich dabei um eine Angular-Website, welche als Datenbasis [Daten und Metadaten](#website) ein Datensatz-Repositories nutzt. Die Website kommt somit ohne Backend aus und wird dadurch einfach wiederverwendbar.

Besteht Interesse die Datensatz-Website für eigene Datensätze, auf Basis des bereitgestellten Codes, zu nutzen, dann kontaktieren Sie uns unter [opendata@rki.de](mailto:opendata@rki.de) oder via GitHub-Issues.

## Voraussetzungen

Für die erfolgreiche Erzeugung einer Datensatz-Website mit GitHub-Actions muss das zugrunde liegende Datensatz-Repository folgende Dateien, Metadaten und Struktur aufweisen:

1. Das Repository muss "public" sein und die Daten frei zugänglich (Open Data)
2. Es existiert ein Readme.md mit ausführlicher Dokumentation der Daten
3. Es liegt eine zenodo.json Datei mit folgenden Metadaten vor:
    - Namen des Datensatzes (zenodo.title)
    - Datum der letzten Aktualisierung (zenodo.publication_date)
    - Autor:innen (zenodo.creators)
    - Beitragende (zenodo.contributors)
    - Kurze Beschreibung/Abstract der Datenquelle und Daten (zenodod.descriptions)
    - Schlagwörter (zenodo.keywords)
5. Es ist eine Lizenz-Datei in dem Repository hinterlegt (z.b [CC-BY](https://creativecommons.org/licenses/by/4.0/deed.de))
6. In den GitHub Metadaten (Feld: "Webseite") des Repositories ist eine [Zenodo](https://zenodo.org) [DOI](https://de.wikipedia.org/wiki/Digital_Object_Identifier) hinterlegt.

Die Datei- und Ordnerstruktur des Datensatz-Repositories wird auf der Datensatz-Website ebenfalls abgebildet. Es wird daher empfohlen die Ordnerstruktur übersichtlich zu halten und die relevanten Daten möglichst im Root-Verzeichnis (oberstes Verzeichnisebene) abzulegen.

## Deployment mit GitHub-Actions

Für das Deployment der Datensatz-Website zwei GitHub-Actions zentral, beide sind im vorliegenden Repository enthalten. 
Im Unterordner [`/createDatasourceJsonAction/`](/createDatasourceJsonAction/) befindest sich die Action "Create datasource.json", die mittels der Github-API alle für die Website benötigten Daten zusammenträgt und in eine JSON-Datei schreibt (./src/app/data/datasource.json).

Über die im Root-Verzeichnis enthaltene [action.yml](#Action-Build-and-deploy-Opendata-Website) stellt das Repository selbst die aufrufbare Action "Build and deploy Opendata-Website" dar. Die [action.yml](#Action-Build-and-deploy-Opendata-Website) enthält alle Schritte, um die Datensatz-Website für eigene Datensatz-Repositories zu bauen und deployen. Die Action "Create datasource.json" ist dabei ein Teilschritt des Workflows der Action "Build and deploy Opendata-Website".  
Damit die Action erfolgreich ausgeführt werden kann, müssen die oben genannten [Voraussetzungen](#voraussetzungen) erfüllt sein.

### Action "Create datasource.json"

Die Action "Create datasource.json" ist für das Erstellen der datasource.json (`/src/app/data/datasource.json`) verantwortlich und wird im Workflow der Action ["Build and deploy Opendata-Website" ](#Action-Build-and-deploy-Opendata-Website) aufgerufen. Der Quellcode der Action befindet sich in `/src/github-action`. Folgende Schritte werden durch die Action ausgeführt:

1. Authentifizierung an GitHub-API mittels GH_TOKEN
2. Abfragen des Datensatz-Repositories, aus dem heraus die Action aufgerufen wurde
3. Hinzufügen des externen Zenodo-Links, sofern Zenodo-DOI in Website eingetragen ist
4. Abfragen der Dateien des Datensatz-Repositories
5. Parsen und Einlesen der zenodo.json um die in [Voraussetzungen](#Voraussetzungen) beschriebenen Metadaten zu extrahieren
6. Einlesen der Dokumentation aus der Readme.md
7. Lizenz auslesen
8. Schreiben der datasource.json nach `./src/app/data/datasource.json`

### Action "Build and deploy Opendata-Website" 

Auf Basis der [action.yml](/action.yml) erzeugt und deployed die Action "Build and deploy Opendata-Website" eine Datensatz Website des aufrufenden Datensatz-Repositories. Die  Action führt dazu vier Schritte aus, die in der [action.yml](/action.yml) definiert sind:

1. Pullen es "OpenData-Website"-Repositories
2. Erzeugen der [datasource.json](#Action-"Create-datasource.json")
3. Installation Node.js
5. Build und Deploy der Opendata-Website (nutzt [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages))

#### Inputs

Für die Ausführung der Actions müssen folgende Informationen als Input übergeben werden: 

```yaml
inputs:
  GH_TOKEN:
    description: "GitHub token"
    default: $
    required: true
  WEBSITE_BRANCH:
    description: "Branch to deploy the website"
    default: "opendata-website"
    required: false
```
| Input          | Required | Default          | Beschreibung |
| -------------- | -------- | ---------------  | ------------ |
| GH_TOKEN       | true     | $                | Ein GitHub Token, welches Zugriff auf das Repository hat. Dieses wird benötigt, um die datasource.json über die GitHub-API zu erzeugen. |
| WEBSITE_BRANCH | false    | "opendata-website" | Der Name des Branchs, in den die Website deployt wird. |

## Implementierung im Datensatz-Repository

Zwei Schritte sind für die Implementierung innerhalb eines Datensatz-Repositories nötig:

1. Anlegen eines Workflows im Ordner `.github/workflows/` der die Action aufruft
2. Festlegung des Source Branches in den Einstellungen des Datensatz-Repositories für die [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) 

### Anlegen eines Workflows

Um die Action ["OpenData-Website"](#Action-"OpenData-Website") in einem eigenen Datensatz-Repository zu nutzen muss folgender Schritt in einem GitHub-Workflow deklariert werden.

```yaml
- name: Create and deploy opendata website
  uses: robert-koch-institut/OpenData-Website@main
  with:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}
    WEBSITE_BRANCH: "opendata-website"
```  

GitHub-Workflows werden im `.github/workflows/` abgelegt. Ein Beispiel für einen Workflow, der einen Datensatz-Website in einem Datensatz-Repository erzeugt, ist in der [implementation_example.yml](./implementation_example.yml) bereitgestellt. Weiterführende Informationen zu [Workflows](https://docs.github.com/en/actions/using-workflows) und [Actions](https://docs.github.com/en/actions) können der GitHub-Dokumentation entnommen werden.

### Festlegung des Source Branches

Nach erfolgreichem Ausführen der [Action "OpenData-Website"](#Action-"OpenData-Website") ist im Datensatz-Repository eine neuer Branch `opendata-website` (deflaut) angelegt. Um die darin gebaute Website über GitHub-Pages anzeigen zu lassen muss unter 

> Settings > Pages > Source

Der Branch `opendata-website` für das Pages-Deployment ausgewählt und gespeichert werden. Im oberen Bereich der Settings wird dann der Link zur Datensatz-Website angezeigt. 


## Website

Die Website ist in Angular 12 geschrieben und wird mittels der Action [OpenData-Website](#Action-"RKI-OpenData-Website") transpiliert und innerhalb des GitHub Datensatz-Repositories in einen eigenen Branch [(siehe Inputs)](#Inputs) gepusht. Der Branch wird von der Action eigenständig angelegt und es bedarf keiner weiteren Vorbereitung des Datensatz-Repository. Für das Deployment der Website durch [GitHub-Pages](https://pages.github.com/) muss in den Einstellungen der entsprechende Branch ausgewählt werden. 

Die Website benötigt kein Backend, da die genutzten Daten mittels der Action [createDatasourceJsonAction](#Action-"Create-datasource.json") erzeugt werden. Im folgenden wird kurz die Datenstruktur der datasource.json beschrieben.

### datasource.json

Alle Daten der Website sind in der `/app/data/datasource.json` gespeichert. Diese wird mit Hilfe der Action "Create datasource.json" erzeugt und hat folgende Struktur:

```typescript
export interface OpenDataDatasource {
    id: string;
    branch: string;
    name: string;
    description: string;

    licence: string;
    tags: string[];
    doi: string;
    lastUpdated: Date;
    contributors: { name: string; role: string }[];
    authors: string[];
    externalLinks: ExternalLink[];
    readme: string;

    content: DatasourceContent[];
}

export interface ExternalLink {
    $type: 'github' | 'zenodo';
    url: string;
}

export interface Contributor {
    name: string;
    role: string;
}

export interface FileDatasourceContent {
    $type: 'file';
    name: string;
    path: string;
    previewUrl: string;
    downloadUrl: string;
    visitUrl: string;
    lfs: boolean;
}

export interface FolderDatasourceContent {
    $type: 'folder';
    name: string;
    path: string;

    content: DatasourceContent[];
}

export type DatasourceContent = FileDatasourceContent | FolderDatasourceContent;
```
