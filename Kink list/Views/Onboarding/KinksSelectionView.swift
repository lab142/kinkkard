//
//  KinksSelectionView.swift
//  Kink list
//
//  Created on 12/6/24.
//

import SwiftUI

struct KinksSelectionView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    @State private var selectedKinks: Set<String> = []
    @State private var searchText: String = ""
    
    let allKinks = [
        "Bondage",
        "Role Play",
        "BDSM",
        "Fetish",
        "Exhibitionism",
        "Voyeurism",
        "Sensory Play",
        "Impact Play",
        "Wax Play",
        "Temperature Play",
        "Edging",
        "Orgasm Control",
        "Multiple Partners",
        "Public Play",
        "Rough Play",
        "Gentle Play",
        "Toys",
        "Anal Play",
        "Oral Play",
        "Kissing",
        "Cuddling",
        "Massage",
        "Tattoos/Piercings",
        "Cosplay",
        "Other"
    ]
    
    var filteredKinks: [String] {
        if searchText.isEmpty {
            return allKinks
        } else {
            return allKinks.filter { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Header
                VStack(spacing: 12) {
                    Text("Select Your Interests")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Choose the things you want to try or are into")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 20)
                
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    TextField("Search kinks...", text: $searchText)
                        .textFieldStyle(PlainTextFieldStyle())
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.1))
                )
                .padding(.horizontal)
                
                // Kinks Selection
                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(filteredKinks, id: \.self) { kink in
                            Button(action: {
                                if selectedKinks.contains(kink) {
                                    selectedKinks.remove(kink)
                                } else {
                                    selectedKinks.insert(kink)
                                }
                            }) {
                                HStack {
                                    Text(kink)
                                        .font(.body)
                                        .foregroundColor(.primary)
                                    Spacer()
                                    if selectedKinks.contains(kink) {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundColor(.blue)
                                    } else {
                                        Image(systemName: "circle")
                                            .foregroundColor(.gray)
                                    }
                                }
                                .padding()
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(selectedKinks.contains(kink) ? Color.blue.opacity(0.1) : Color.gray.opacity(0.1))
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(selectedKinks.contains(kink) ? Color.blue : Color.clear, lineWidth: 2)
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Continue Button
                Button(action: {
                    onboardingManager.completeKinks(kinks: Array(selectedKinks))
                }) {
                    Text("Complete Setup")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(selectedKinks.isEmpty ? Color.gray : Color.blue)
                        )
                }
                .disabled(selectedKinks.isEmpty)
                .padding(.horizontal)
                .padding(.bottom, 20)
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true) // Prevent going back - must complete flow
        }
    }
}

#Preview {
    KinksSelectionView()
        .environmentObject(OnboardingManager())
}


