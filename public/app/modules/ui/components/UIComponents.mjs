/*
  ______ _____
 |  ____|  __ \
 | |__  | |__) |_ _  __ _  ___
 |  __| |  ___/ _` |/ _` |/ _ \
 | |    | |  | (_| | (_| |  __/
 |_|    |_|   \__,_|\__, |\___|
                     __/ |
                    |___/
 */
/**
 * @name FPage framework
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import Button from "./Button.mjs";
import PunkListCard from "./PunkListCard.mjs";
import PunkListCatalog from "./PunkListCatalog.mjs";
import TextInput from "./TextInput.mjs";
import FoldableBox from "./FoldableBox.mjs";
import PixelatedImage from "./PixelatedImage.mjs";
import Caption from "./Caption.mjs";
import BadgesList from "./BadgesList.mjs";
import StateView from "./StateView.mjs";
import Popup from "./Popup.mjs";
import PrimaryButton from "./PrimaryButton.mjs";
import Slider from "./Slider.mjs";
import Holder from "./Holder.mjs";
import NumberSelector from "./NumberSelector.mjs";
import TemplateLoader from "./TemplateLoader.mjs";
import Checkbox from "./Checkbox.mjs";
import FormGroup from "./FormGroup.mjs";
import CopyableTextInput from "./CopyableTextInput.mjs";
import ProgressBar from "./ProgressBar.mjs";
import FaqSlide from "./FaqSlide.mjs";
import CaptionedBox from "./CaptionedBox.mjs";

const UIComponents = {
    button: Button,
    primarybutton: PrimaryButton,
    punklistcard: PunkListCard,
    punklistcatalog: PunkListCatalog,
    textinput: TextInput,
    foldablebox: FoldableBox,
    captionedbox: CaptionedBox,
    pixelatedimage: PixelatedImage,
    caption: Caption,
    badgeslist: BadgesList,
    stateview: StateView,
    popup: Popup,
    slider: Slider,
    numberselector: NumberSelector,
    holder: Holder,
    templateloader: TemplateLoader,
    checkbox: Checkbox,
    formgroup: FormGroup,
    copyabletextinput: CopyableTextInput,
    progressbar: ProgressBar,
    faqslide: FaqSlide

}

export default UIComponents;