//
//  OrientationView.swift
//  Kink list
//
//  Created on 12/6/24.
//

import SwiftUI

struct OrientationView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    @State private var selectedOrientation: String? = nil
    
    let orientations = [
        "Straight",
        "Gay",
        "Lesbian",
        "Bisexual",
        "Pansexual",
        "Asexual",
        "Queer",
        "Questioning",
        "Other"
    ]
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 30) {
                // Header
                VStack(spacing: 12) {
                    Text("Welcome to Wink Kard")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Let's get started with your orientation")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 40)
                
                // Orientation Selection
                VStack(spacing: 16) {
                    Text("What is your orientation?")
                        .font(.headline)
                        .padding(.bottom, 8)
                    
                    ForEach(orientations, id: \.self) { orientation in
                        Button(action: {
                            selectedOrientation = orientation
                        }) {
                            HStack {
                                Text(orientation)
                                    .font(.body)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedOrientation == orientation {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.blue)
                                }
                            }
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(selectedOrientation == orientation ? Color.blue.opacity(0.1) : Color.gray.opacity(0.1))
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(selectedOrientation == orientation ? Color.blue : Color.clear, lineWidth: 2)
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal)
                
                Spacer()
                
                // Continue Button
                Button(action: {
                    if let orientation = selectedOrientation {
                        onboardingManager.completeOrientation(orientation: orientation)
                    }
                }) {
                    Text("Continue")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(selectedOrientation != nil ? Color.blue : Color.gray)
                        )
                }
                .disabled(selectedOrientation == nil)
                .padding(.horizontal)
                .padding(.bottom, 30)
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    OrientationView()
        .environmentObject(OnboardingManager())
}


