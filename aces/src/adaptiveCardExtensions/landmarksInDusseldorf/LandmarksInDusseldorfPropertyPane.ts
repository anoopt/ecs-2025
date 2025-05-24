import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'LandmarksInDusseldorfAdaptiveCardExtensionStrings';

export class LandmarksInDusseldorfPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                 PropertyPaneTextField('mainImage', {
                  label: "Image to show on the card"
                }),
                PropertyPaneToggle('allowMultipleExpanded', {
                  label: "Allow multiple expanded items"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
