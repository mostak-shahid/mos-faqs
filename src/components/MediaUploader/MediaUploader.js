import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import removeMedia from '../../assets/images/removeMedia.svg';
import uploadMedia from '../../assets/images/uploadMedia.svg';
import Hint from '../Hint/Hint';
import './MediaUploader.scss';
export default function MediaUploader({ data, name, handleChange, options={} }) {    
    const [media, setMedia] = useState({});

    useEffect(()=> {
        setMedia(data)
    },[data])
    const runUploader = (event) => {
        let frame
        event.preventDefault()

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open()
            return
        }

        // Create a new media frame
        frame = wp.media({
            title: options?.frame?.title || __("Select or Upload Image", "ultimate-security"),
            button: {
                text: options?.buttons?.select || __("Use this image", "ultimate-security"),
            },
            multiple: false, // Set to true to allow multiple files to be selected
            library: options?.library || {type: 'image'},
        })
        frame.on("open", function() {
			let selection = frame.state().get('selection');
			let attachment = wp.media.attachment(media?.id);
			selection.add(attachment ? [attachment] : []);
			/*
			let ids = []; // array of IDs of previously selected files. You're gonna build it dynamically
			ids.forEach(function(id) {
			  let attachment = wp.media.attachment(id);
			  selection.add(attachment ? [attachment] : []);
			}); // would be probably a good idea to check if it is indeed a non-empty array
			*/
		});
        frame.on("select", function(){
            var image = frame.state().get("selection").first().toJSON();
            var thumbnail = (image.sizes.thumbnail.url)?image.sizes.thumbnail.url:image.url;
            // console.log(image);
            setMedia({id:image.id, url:image.url});
            handleChange(name, {id:image.id, url:image.url});
        });	

        // Finally, open the modal on click
        frame.open()
    }
    const removeImage  = (event) => {
        event.preventDefault();
        setMedia({id:0, url:''});
        handleChange(name, {id:0, url:''});
    }
    return (
        <>
            {console.log('component-load:','MediaUploader is rendered')}
            {console.log('data', data)}
            {console.log('media', media)}
            <div className="usfw-media-uploader-unit">
                <div className="media-uploader">
                    { media?.url && media?.id ?                     
                        <div className="file-name mb-medium background-primary with-close-button">
                            <img className="uploaded-image" src={media?.sizes?.thumbnail?.url? media.sizes.thumbnail.url:media.url} onClick={runUploader} />
                            <img className="usfw-remove-image" onClick={removeImage} src={removeMedia} alt="" />
                        </div> : 
                        <div className="file-name mb-medium background-primary d-flex align-items-center justify-content-center" onClick={runUploader}>
                            <div className="no-media-wrap">
                                <div className="img-wrap">
                                    <img className="uploaded-image" src={uploadMedia} />
                                </div>  
                                <div className="text-wrap">
                                    <span className="title">{__("Upload Image", "ultimate-security")}</span>
                                    <span className="sub-title">{__("Use the upload button", "ultimate-security")} <br/> {__("and select media  ", "ultimate-security")}</span>
                                </div> 

                            </div>
                        </div>
                    }
                    <div className="file-detail">
                        {
                            options?.message?.size && 
                            <div className="upload-help-text pl-body text-text mb-medium" dangerouslySetInnerHTML={{__html: options.message.size}}/>
                        }
                        <div className="button-wrapper">
                            <button type="button" className="button button-primary" onClick={runUploader}>
                                {options?.buttons?.upload || __("Upload Image", "ultimate-security")}
                            </button>                        
                            <button type="button" className="button button-secondary" onClick={removeImage}>
                                {options?.buttons?.remove || __("Remove", "ultimate-security")}
                            </button>                        
                        </div>
                        <div className="file-link">
                            <label>
                                <div className="input-with-hints has-hint">
                                    {
                                        options?.hint &&
                                        <Hint content={options.hint} />
                                    }
                                    <span className="input-lavel pl-heading-1 text-heading fw-600">
                                    {__("File link:", "ultimate-security")}
                                    </span>
                                </div>
                                
                                <input type="text" value={media?.url? media.url:''} readOnly />
                                <input type="hidden" value={media?.id? media.id:''} readOnly/>
                                {
                                    options?.message?.info && 
                                    <div className="input-help mt-small"  dangerouslySetInnerHTML={{__html: options.message.info}} />
                                }
                            </label>
                        </div>
                    </div>                    
                </div>
            </div>
        </>        
    )
}
/*
// Uses
<MediaUploader 
    data={settingData?.elements?.advanced?.media_uploader} 
    name='elements.advanced.media_uploader' 
    handleChange={handleChange}
    options = {{
        frame:{
            title: __("Select or Upload Image", "ultimate-security"),
        },
        library: {type: 'image'},
        buttons: {
            upload: __("Upload Image", "ultimate-security"),
            remove: __("Remove", "ultimate-security"),
            select: __("Use this image", "ultimate-security")                                            
        },
        hint: __("No Hint", "ultimate-security"),
        message: {
            size: 'Size: Optional <br> File Support: jpg, .jpeg, . gif, or .png.',
            info: 'Select the background image for the header'
        } 
    }}
/>
*/