import React, { useState, useRef } from 'react';
import {
    Text,
    View,
    SafeAreaView, Dimensions, ImageBackground
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');
const { height: screenHeight } = Dimensions.get('window');
export default () => {
    const carouselRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [carouselItems, setCarouselItems] = useState([
        {
            title: "Item 1",
            text: "Text 1",
        },
        {
            title: "Item 2",
            text: "Text 2",
        },
        {
            title: "Item 3",
            text: "Text 3",
        },
        {
            title: "Item 4",
            text: "Text 4",
        },
        {
            title: "Item 5",
            text: "Text 5",
        },
    ])

    const _renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: '#ccc', borderRadius: 15, height: 450 }}>
                <ImageBackground borderRadius={15} style={{
                    flex: 1,
                    borderRadius: 15,
                    resizeMode: "cover",
                }} source={{ uri: "https://reactjs.org/logo-og.png" }} >
                    <Text style={{ fontSize: 30 }}>{item.title}</Text>
                    <Text>{item.text}</Text>
                </ImageBackground>

            </View>

        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#433', paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                <Carousel
                    layout={"default"}
                    ref={carouselRef}
                    data={carouselItems}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth - 30}
                    renderItem={_renderItem}
                    onSnapToItem={index => setActiveIndex(index)} />
            </View>
        </SafeAreaView>
    )

}

