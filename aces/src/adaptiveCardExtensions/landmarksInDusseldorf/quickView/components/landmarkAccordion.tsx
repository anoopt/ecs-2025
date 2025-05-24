// A react functional component that renders the FAQ accordion

import * as React from 'react';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import { Landmark } from '../../../../types';
import { createAccordionStyles, chevronDown } from '../../styles';
import { Remarkable } from 'remarkable';
import * as DOMPurify from 'dompurify';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { useThemedStyles } from '../../../../hooks/useThemedStyles';
import { AadHttpClientFactory } from '@microsoft/sp-http';
import { useAzureFunctions } from '../../../../hooks';

export interface ILandmarksAccordionProps {
    aadHttpClientFactory: AadHttpClientFactory;
    allowMultipleExpanded: boolean;
    theme: IReadonlyTheme | undefined;
}

export const LandmarksAccordion: React.FunctionComponent<ILandmarksAccordionProps> = (props) => {
    const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
    const { aadHttpClientFactory, allowMultipleExpanded, theme } = props;
    const { getDusseldorfLandmarks } = useAzureFunctions(aadHttpClientFactory);
    const accordionStyles = useThemedStyles(theme, createAccordionStyles);
    const chevronDownIcon = chevronDown(theme);

    const loadLandmarks = React.useCallback(async () => {
        try {
            const landmarksResponse: any = await getDusseldorfLandmarks();
            console.log('Landmarks response:', landmarksResponse);
            
            if (landmarksResponse && landmarksResponse.landmarks && landmarksResponse.landmarks.length > 0) {
                setLandmarks(landmarksResponse.landmarks.slice(0,4) as Landmark[]);
            } else {
                console.warn('No landmarks found in the response');
            }
        } catch (error) {
            console.error('Error loading landmarks:', error);
            setLandmarks([]);
        }
    }, [getDusseldorfLandmarks]);

    
    const md = new Remarkable({
        html: true
    });
    landmarks.forEach(landmark => {
        landmark.shortDescription = md.render(landmark.shortDescription);
    });

    const AccordionItem: React.FC<{ header: string } & React.ComponentProps<typeof Item>> = ({ header, ...rest }) => (
        <Item
            {...rest}
            header={
                <>
                    {header}
                    <img className="chevron-down" src={chevronDownIcon} alt="Chevron Down" />
                </>
            }
        />
    );

    React.useEffect(() => {
        void loadLandmarks();
    }, []);

    return (
        <div className={accordionStyles.accordion}>
            <Accordion transition transitionTimeout={500} allowMultiple={allowMultipleExpanded}>
                {landmarks.map((landmark, index) => (
                    <AccordionItem header={landmark.title}>
                         <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landmark.shortDescription) }} />
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};