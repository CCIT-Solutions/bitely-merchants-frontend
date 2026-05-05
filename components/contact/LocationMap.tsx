"use client";
import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Translate from "@/components/shared/Translate"; // Adjust path if needed
import { FaMoon, FaSatellite } from "react-icons/fa";

interface LocationMapProps {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
  border: "1px solid #222",
  overflow: "hidden",
  position: "relative" as "relative",
};

const locationMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },

  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#333333" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#6ef843" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#585858" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#3a3a3a" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#ffffff" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "on" }, { color: "#000000" }],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "on" }],
  },
];

const LocationMap: React.FC<LocationMapProps> = ({ lat, lng }) => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [mapMode, setMapMode] = useState<"dark" | "satellite">("dark");

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div
    style={{ position: "relative", width: "100%", height: "100%" }}
      onWheel={(e) => e.stopPropagation()}
    >
      <GoogleMap
        mapContainerClassName="rounded-map"
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={9}
        options={{
          mapTypeId: mapMode === "satellite" ? "hybrid" : "roadmap",
          styles: mapMode === "dark" ? locationMapStyle : undefined,
          disableDefaultUI: true,
          gestureHandling: "greedy" ,
          keyboardShortcuts: false,
        }}
      >
        <Marker
          position={{ lat, lng }}
          icon={
            mapMode === "dark"
              ? {
                  url: "/media/icons/map-marker.png",
                  scaledSize: new window.google.maps.Size(60, 60),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(30, 30),
                }
              : undefined
          }
        />
      </GoogleMap>


    </div>
  );
};

export default LocationMap;
