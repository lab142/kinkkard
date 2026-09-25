//
//  GuestProfileViewModel.swift
//  Kink list
//
//  Created on 12/7/24.
//

import Foundation
import SwiftUI

class GuestProfileViewModel: ObservableObject {
    @Published var guestName: String = ""
    @Published var favoritePositions: Set<String> = []
    @Published var intoKinks: Set<String> = []
    @Published var wouldTryKinks: Set<String> = []
    
    func togglePosition(_ position: String) {
        if favoritePositions.contains(position) {
            favoritePositions.remove(position)
        } else {
            favoritePositions.insert(position)
        }
    }
    
    func toggleKinkSelection(kink: String, category: String) {
        if category == "into" {
            if intoKinks.contains(kink) {
                intoKinks.remove(kink)
            } else {
                intoKinks.insert(kink)
                wouldTryKinks.remove(kink) // Remove from would try if adding to into
            }
        } else if category == "wouldTry" {
            if wouldTryKinks.contains(kink) {
                wouldTryKinks.remove(kink)
            } else {
                wouldTryKinks.insert(kink)
                intoKinks.remove(kink) // Remove from into if adding to would try
            }
        }
    }
    
    // Import profile from scanned QR code
    func importQRData(_ jsonString: String) {
        guard let jsonData = jsonString.data(using: .utf8),
              let decoded = try? JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] else {
            print("❌ Failed to decode QR data")
            return
        }
        
        DispatchQueue.main.async {
            let importedName = decoded["name"] as? String ?? "Guest"
            let importedPositions = decoded["favoritePositions"] as? [String] ?? []
            let importedIntoKinks = decoded["intoKinks"] as? [String] ?? []
            let importedWouldTryKinks = decoded["wouldTryKinks"] as? [String] ?? []
            
            self.guestName = importedName
            self.favoritePositions = Set(importedPositions)
            self.intoKinks = Set(importedIntoKinks)
            self.wouldTryKinks = Set(importedWouldTryKinks)
            
            print("✅ Guest profile imported: \(self.guestName)")
            print("   Positions: \(Array(self.favoritePositions).sorted())")
            print("   Into Kinks: \(Array(self.intoKinks).sorted())")
            print("   Would Try Kinks: \(Array(self.wouldTryKinks).sorted())")
        }
    }
    
    func clearGuestData() {
        guestName = ""
        favoritePositions.removeAll()
        intoKinks.removeAll()
        wouldTryKinks.removeAll()
    }
}




